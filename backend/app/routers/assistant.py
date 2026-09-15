"""RAG-powered guest assistant endpoint."""

from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app import crud
from app.database import get_db
from app.models import Property, UnitListing
from app.mongo import get_preferences_collection
from app.rag.pipeline import answer_question


router = APIRouter(
    prefix="/api/v1/assistant",
    tags=["assistant"],
)


class AssistantQuery(BaseModel):
    guest_id: str | None = Field(
        default=None,
        description="Optional guest ID",
    )

    unit_id: str | None = Field(
        default=None,
        description="Optional unit listing ID",
    )

    question: str = Field(
        ...,
        min_length=1,
        max_length=1000,
    )


class AssistantAnswer(BaseModel):
    answer: str
    sources: list[dict[str, Any]]


def _question_contains(
    question: str,
    words: tuple[str, ...],
) -> bool:
    question_lower = question.lower()
    return any(word in question_lower for word in words)


def _get_guest_context(
    db: Session,
    guest_id: str,
    question: str,
) -> list[dict[str, Any]]:
    """
    Retrieve only guest information relevant to the question.
    """

    guest = crud.get_guest(db, guest_id)

    if not guest:
        raise HTTPException(
            status_code=404,
            detail="Guest not found",
        )

    context: list[dict[str, Any]] = []

    # ---------------------------------------------------------
    # BASIC GUEST PROFILE
    # ---------------------------------------------------------

    if _question_contains(
        question,
        (
            "my profile",
            "my account",
            "my name",
            "my email",
            "loyalty",
            "membership",
        ),
    ):
        context.append(
            {
                "type": "guest_profile",
                "content": (
                    f"Guest name: {guest.name}\n"
                    f"Email: {guest.email}\n"
                    f"Phone: {guest.phone or 'Not provided'}\n"
                    f"Loyalty tier: {guest.loyalty_tier}"
                ),
            }
        )

    # ---------------------------------------------------------
    # GUEST PREFERENCES
    # ---------------------------------------------------------

    if _question_contains(
        question,
        (
            "preference",
            "preferences",
            "dietary",
            "diet",
            "food",
            "meal",
            "room preference",
            "room preferences",
            "special request",
            "special requests",
            "note",
            "notes",
        ),
    ):
        prefs_collection = get_preferences_collection()

        prefs_doc = (
            prefs_collection.find_one(
                {"guest_id": guest_id}
            )
            or {}
        )

        dietary = prefs_doc.get("dietary", [])
        room_preferences = prefs_doc.get(
            "room_preferences",
            [],
        )
        notes = prefs_doc.get("notes", [])

        context.append(
            {
                "type": "guest_preferences",
                "content": (
                    f"Guest preferences for {guest.name}:\n"
                    f"Dietary preferences: "
                    f"{', '.join(dietary) if dietary else 'None recorded'}\n"
                    f"Room preferences: "
                    f"{', '.join(room_preferences) if room_preferences else 'None recorded'}\n"
                    f"Notes: "
                    f"{', '.join(notes) if notes else 'None recorded'}"
                ),
            }
        )

    # ---------------------------------------------------------
    # RESERVATIONS
    # ---------------------------------------------------------

    if _question_contains(
        question,
        (
            "booking",
            "bookings",
            "reservation",
            "reservations",
            "stay",
            "stays",
            "check in",
            "check-in",
            "check out",
            "check-out",
            "trip",
            "upcoming",
        ),
    ):
        reservations = crud.list_reservations(
            db,
            property_id=None,
            status=None,
        )

        guest_reservations = [
            reservation
            for reservation in reservations
            if reservation.guest_id == guest_id
        ]

        if guest_reservations:
            for reservation in guest_reservations:
                context.append(
                    {
                        "type": "reservation",
                        "reservation_id": str(
                            reservation.id
                        ),
                        "content": (
                            f"Guest reservation:\n"
                            f"Reservation ID: {reservation.id}\n"
                            f"Check-in: "
                            f"{reservation.check_in.isoformat()}\n"
                            f"Check-out: "
                            f"{reservation.check_out.isoformat()}\n"
                            f"Status: "
                            f"{reservation.status.value}\n"
                            f"Property ID: "
                            f"{reservation.property_id}\n"
                            f"Rate plan ID: "
                            f"{reservation.rate_plan_id or 'Not specified'}"
                        ),
                    }
                )
        else:
            context.append(
                {
                    "type": "reservation",
                    "content": (
                        f"No reservations were found for "
                        f"guest {guest.name}."
                    ),
                }
            )

    return context


@router.post(
    "/query",
    response_model=AssistantAnswer,
)
def assistant_query(
    payload: AssistantQuery,
    db: Session = Depends(get_db),
):
    """
    Answer a guest question using property knowledge,
    unit knowledge, and optional guest-specific context.
    """

    # ---------------------------------------------------------
    # DETERMINE PROPERTY
    # ---------------------------------------------------------

    property_id: str | None = None

    if payload.unit_id:

        unit = (
            db.query(UnitListing)
            .filter(
                UnitListing.id == str(payload.unit_id)
            )
            .first()
        )

        if not unit:
            raise HTTPException(
                status_code=404,
                detail="Unit listing not found",
            )

        if not unit.property_id:
            raise HTTPException(
                status_code=400,
                detail=(
                    "Unit listing is not linked "
                    "to a property"
                ),
            )

        property_id = str(unit.property_id)

    else:

        property_obj = (
            db.query(Property)
            .first()
        )

        if not property_obj:
            raise HTTPException(
                status_code=404,
                detail="No property found",
            )

        property_id = str(property_obj.id)

    # ---------------------------------------------------------
    # GUEST CONTEXT
    # ---------------------------------------------------------

    extra_context: list[dict[str, Any]] = []

    if payload.guest_id:
        extra_context = _get_guest_context(
            db=db,
            guest_id=payload.guest_id,
            question=payload.question,
        )

    # ---------------------------------------------------------
    # RAG PIPELINE
    # ---------------------------------------------------------

    try:

        result = answer_question(
            question=payload.question,
            property_id=property_id,
            unit_listing_id=(
                str(payload.unit_id)
                if payload.unit_id
                else None
            ),
            extra_context=extra_context,
        )

    except Exception as exc:

        raise HTTPException(
            status_code=500,
            detail=f"Assistant failed: {exc}",
        ) from exc

    return AssistantAnswer(
        answer=result["answer"],
        sources=result["sources"],
    )