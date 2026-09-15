"""Tests for the Sprint 3 RAG assistant endpoint (grounded, DB-backed answers)."""

from datetime import date, timedelta

from tests.factories import make_property_guest_plan, make_reservation, make_unit_listing


def test_assistant_answers_listing_question_from_db(client, db_session):
    _property, _guest, _rate_plan = make_property_guest_plan(db_session)
    make_unit_listing(db_session, name="Garden Suite", location="Ground Floor")
    db_session.commit()

    resp = client.post(
        "/api/v1/assistant/query",
        json={"guest_id": None, "question": "What stays are available?"},
    )
    assert resp.status_code == 200
    body = resp.json()
    assert "Garden Suite" in body["answer"]
    assert body["sources"], "retrieved context should be reported as sources"
    assert any(source["type"] == "unit_listing" for source in body["sources"])


def test_assistant_answers_preferences_question_with_guest_context(
    client, db_session, preferences_store
):
    _property, guest, _rate_plan = make_property_guest_plan(db_session)
    preferences_store[guest.id] = {
        "guest_id": guest.id,
        "dietary": ["vegetarian"],
        "room_preferences": ["high floor"],
        "notes": [],
    }
    db_session.commit()

    resp = client.post(
        "/api/v1/assistant/query",
        json={"guest_id": guest.id, "question": "Do you have my dietary preferences on file?"},
    )
    assert resp.status_code == 200
    answer = resp.json()["answer"]
    assert "vegetarian" in answer

    source_types = [source["type"] for source in resp.json()["sources"]]
    assert "guest_preferences" in source_types


def test_assistant_reports_reservation_when_asked(client, db_session):
    property_, guest, rate_plan = make_property_guest_plan(db_session)
    make_reservation(
        db_session,
        guest,
        property_,
        rate_plan,
        check_in=date.today() + timedelta(days=2),
        check_out=date.today() + timedelta(days=5),
    )
    db_session.commit()

    resp = client.post(
        "/api/v1/assistant/query",
        json={"guest_id": guest.id, "question": "When is my next booking?"},
    )
    assert resp.status_code == 200
    source_types = [source["type"] for source in resp.json()["sources"]]
    assert "reservation" in source_types


def test_assistant_empty_question_rejected(client, db_session):
    resp = client.post("/api/v1/assistant/query", json={"question": "   "})
    assert resp.status_code == 400
