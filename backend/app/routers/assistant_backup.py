"""Sprint 3 RAG assistant endpoint.

Retrieves real guest/property/unit-listing data (Postgres) plus the current
guest's preference document (Mongo), then synthesizes an answer from that
context. When OPENAI_API_KEY is configured the synthesis is delegated to the
OpenAI chat completions API over the retrieved context; otherwise a deterministic
template answer over the same context is returned, so the endpoint is always
grounded in real database data (never hardcoded answers).
"""

from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from pymongo.collection import Collection
from sqlalchemy.orm import Session

from app import crud
from app.config import settings
from app.database import get_db
from app.models import UnitListing
from app.mongo import get_preferences_collection

router = APIRouter(prefix="/api/v1/assistant", tags=["assistant"])


class AssistantQuery(BaseModel):
    guest_id: str | None = Field(
        default=None, description="Optional guest id for profile-aware retrieval"
    )
    unit_id: str | None = Field(
        default=None,
        description=(
            "Optional unit listing id. When provided, retrieval is scoped to that "
            "property's listing so the answer cannot draw on another property."
        ),
    )
    question: str = Field(..., min_length=1, max_length=1000)


class AssistantAnswer(BaseModel):
    answer: str
    sources: list[dict[str, Any]]


def _retrieve_context(
    db: Session,
    question_lower: str,
    guest_id: str | None,
    prefs_collection: Collection,
    unit_id: str | None = None,
) -> list[dict[str, Any]]:
    """Retrieve real DB rows relevant to the question. No hardcoded content."""
    context: list[dict[str, Any]] = []

    # Guest profile + preferences
    if guest_id:
        guest = crud.get_guest(db, guest_id)
        if guest:
            context.append(
                {
                    "type": "guest_profile",
                    "id": guest.id,
                    "name": guest.name,
                    "email": guest.email,
                    "phone": guest.phone,
                    "loyalty_tier": guest.loyalty_tier,
                }
            )

            if any(
                word in question_lower
                for word in ("preference", "dietary", "diet", "room", "note", "food")
            ):
                prefs_doc = prefs_collection.find_one({"guest_id": guest_id}) or {}
                context.append(
                    {
                        "type": "guest_preferences",
                        "guest_id": guest_id,
                        "dietary": prefs_doc.get("dietary", []),
                        "room_preferences": prefs_doc.get("room_preferences", []),
                        "notes": prefs_doc.get("notes", []),
                    }
                )

            if any(
                word in question_lower
                for word in ("booking", "reservation", "stay", "check in", "check-in", "trip")
            ):
                reservations = crud.list_reservations(db, property_id=None, status=None)
                context.extend(
                    {
                        "type": "reservation",
                        "id": reservation.id,
                        "guest_id": reservation.guest_id,
                        "property_id": reservation.property_id,
                        "check_in": reservation.check_in.isoformat(),
                        "check_out": reservation.check_out.isoformat(),
                        "status": reservation.status.value,
                    }
                    for reservation in reservations
                    if reservation.guest_id == guest_id
                )

    # Unit listings (mentions of stays/rooms/prices/amenities or any question).
    # When unit_id is provided (property-specific chat), scope to that listing so
    # the answer can only draw on the property the guest is viewing.
    if any(
        word in question_lower
        for word in (
            "unit",
            "listing",
            "room",
            "rate",
            "price",
            "amenit",
            "property",
            "stay",
            "available",
        )
    ) or not context:
        listings_query = db.query(UnitListing).order_by(UnitListing.created_at.desc())
        if unit_id:
            scoped = listings_query.filter(UnitListing.id == str(unit_id)).all()
            if scoped:
                listings = scoped
            else:
                listings = []
        else:
            listings = listings_query.limit(10).all()
        context.extend(
            {
                "type": "unit_listing",
                "id": listing.id,
                "name": listing.name,
                "location": listing.location,
                "nightly_rate": float(listing.nightly_rate or 0),
                "status": listing.status,
                "amenities": listing.amenities or [],
                "check_in_time": listing.check_in_time,
                "check_out_time": listing.check_out_time,
            }
            for listing in listings
        )

    return context


def _format_context_for_prompt(context: list[dict[str, Any]]) -> str:
    lines: list[str] = []
    for item in context:
        if item["type"] == "guest_profile":
            lines.append(
                f"Guest profile: {item['name']} ({item['email']}), "
                f"loyalty tier {item['loyalty_tier']}."
            )
        elif item["type"] == "guest_preferences":
            lines.append(
                f"Guest preferences: dietary={item['dietary']}, "
                f"room={item['room_preferences']}, notes={item['notes']}."
            )
        elif item["type"] == "reservation":
            lines.append(
                f"Reservation {item['id']}: {item['check_in']} to {item['check_out']} "
                f"({item['status']}) at property {item['property_id']}."
            )
        elif item["type"] == "unit_listing":
            lines.append(
                f"Unit listing '{item['name']}' in {item['location'] or 'unspecified location'}: "
                f"{item['nightly_rate']:.2f}/night, status {item['status']}, "
                f"amenities: {', '.join(item['amenities']) or 'none listed'}; "
                f"check-in {item['check_in_time'] or 'flexible'}, "
                f"check-out {item['check_out_time'] or 'flexible'}."
            )
    return "\n".join(lines)


def _extractive_answer(question: str, context: list[dict[str, Any]]) -> str:
    """Template answer grounded strictly in the retrieved context (no API key needed)."""
    guests = [c for c in context if c["type"] == "guest_profile"]
    prefs = [c for c in context if c["type"] == "guest_preferences"]
    reservations = [c for c in context if c["type"] == "reservation"]
    listings = [c for c in context if c["type"] == "unit_listing"]

    parts: list[str] = []

    if guests:
        guest = guests[0]
        parts.append(
            f"Hi {guest['name'].split()[0]}! You're on the {guest['loyalty_tier']} loyalty tier."
        )

    if prefs and any(
        word in question.lower()
        for word in ("preference", "dietary", "diet", "food", "room")
    ):
        doc = prefs[0]
        bits: list[str] = []
        if doc["dietary"]:
            bits.append(f"dietary needs: {', '.join(doc['dietary'])}")
        if doc["room_preferences"]:
            bits.append(f"room preferences: {', '.join(doc['room_preferences'])}")
        if doc["notes"]:
            bits.append(f"notes: {'; '.join(doc['notes'])}")
        if bits:
            parts.append("On file we have " + "; ".join(bits) + ".")

    if reservations and any(
        word in question.lower()
        for word in ("booking", "reservation", "stay", "trip", "check in", "check-in")
    ):
        res = reservations[0]
        parts.append(
            f"Your upcoming reservation runs {res['check_in']} to {res['check_out']} "
            f"(currently {res['status']})."
        )

    if listings:
        unit_name = listings[0]["name"]
        if any(
            word in question.lower()
            for word in ("check in", "check-in", "check out", "check-out", "checkout")
        ) and any(listings):
            times = listings[0]
            parts.append(
                f"At '{unit_name}' check-in is {times['check_in_time'] or 'flexible'} "
                f"and check-out is {times['check_out_time'] or 'flexible'}."
            )
        elif any(
            word in question.lower()
            for word in ("wifi", "wi-fi", "internet", "amenit", "house rules", "rules")
        ):
            amenities = listings[0]["amenities"]
            if amenities:
                parts.append(
                    f"'{unit_name}' lists these amenities: {', '.join(amenities)}. "
                    "I couldn't find more detailed house rules in this property's "
                    "available documents."
                )
            else:
                parts.append(
                    f"I couldn't find that information in this property's available "
                    f"documents. '{unit_name}' has no amenities listed yet."
                )
        elif any(
            word in question.lower()
            for word in ("rate", "price", "cost", "how much", "cheap")
        ):
            cheapest = min(listings, key=lambda c: c["nightly_rate"])
            parts.append(
                f"Our best current rate is {cheapest['nightly_rate']:.2f}/night at "
                f"'{cheapest['name']}'."
            )
        else:
            names = ", ".join(f"'{item['name']}'" for item in listings[:3])
            parts.append(f"Stays you might like: {names}.")

    if not parts:
        parts.append(
            "I couldn't find anything in our records for that yet. Try asking about your "
            "profile, preferences, bookings, or our available stays."
        )

    return " ".join(parts)


def _synthesize_with_llm(question: str, context_text: str, guest_name: str | None) -> str:
    """Use OpenAI chat completions over the retrieved context when a key is configured."""
    import json
    from urllib.request import Request, urlopen

    api_key = settings.openai_api_key
    if not api_key:
        return ""

    system_prompt = (
        "You are the Meridian Stays hospitality assistant. Answer the guest's question "
        "using ONLY the provided context from our booking system. Be warm, concise, and "
        "helpful. If the context doesn't contain the answer, say so honestly."
    )
    user_prompt = (
        f"Context from our booking system:\n{context_text}\n\n"
        f"Guest name: {guest_name or 'Guest'}\n\n"
        f"Question: {question}"
    )

    payload = json.dumps(
        {
            "model": "gpt-4o-mini",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            "max_tokens": 350,
            "temperature": 0.4,
        }
    ).encode("utf-8")

    request = Request(
        "https://api.openai.com/v1/chat/completions",
        data=payload,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
        },
        method="POST",
    )

    try:
        with urlopen(request, timeout=20) as response:
            body = json.loads(response.read().decode("utf-8"))
        return body["choices"][0]["message"]["content"].strip()
    except Exception:
        # Any LLM failure falls back to the template answer over the same context.
        return ""


@router.post("/query", response_model=AssistantAnswer)
def query_assistant(
    payload: AssistantQuery,
    db: Session = Depends(get_db),
    prefs_collection: Collection = Depends(get_preferences_collection),
):
    question = payload.question.strip()
    if not question:
        raise HTTPException(status_code=400, detail="question must not be empty")

    context = _retrieve_context(
        db, question.lower(), payload.guest_id, prefs_collection, payload.unit_id
    )
    context_text = _format_context_for_prompt(context)

    guest_name = next(
        (item["name"] for item in context if item["type"] == "guest_profile"), None
    )

    answer = _synthesize_with_llm(question, context_text, guest_name)
    if not answer:
        answer = _extractive_answer(question, context)

    return AssistantAnswer(
        answer=answer,
        sources=[{"type": item["type"], "id": item.get("id")} for item in context],
    )
