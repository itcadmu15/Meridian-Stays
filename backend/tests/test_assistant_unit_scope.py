"""Tests for the property-scoped (unit_id) RAG assistant behavior."""

from tests.factories import make_property_guest_plan, make_unit_listing


def test_assistant_unit_id_scopes_listing_context(client, db_session):
    _property, _guest, _rate_plan = make_property_guest_plan(db_session)
    make_unit_listing(db_session, name="Seaside Villa", location="Beach Road")
    other = make_unit_listing(db_session, name="Mountain Chalet", location="Hill Top")
    db_session.commit()

    resp = client.post(
        "/api/v1/assistant/query",
        json={"unit_id": other.id, "question": "What are the house rules here?"},
    )
    assert resp.status_code == 200
    body = resp.json()

    assert body["sources"], "scoped query should still report sources"
    source_ids = [source.get("id") for source in body["sources"]]
    assert other.id in source_ids
    assert all(
        source.get("id") in (other.id, None) for source in body["sources"]
    ), "no other property's listing may leak into a scoped answer"


def test_assistant_unit_id_with_unknown_unit_falls_back_to_empty(client, db_session):
    _property, _guest, _rate_plan = make_property_guest_plan(db_session)
    make_unit_listing(db_session, name="Seaside Villa")
    db_session.commit()

    resp = client.post(
        "/api/v1/assistant/query",
        json={"unit_id": "not-a-real-unit", "question": "What is the Wi-Fi policy?"},
    )
    assert resp.status_code == 200
    body = resp.json()
    assert "couldn't find" in body["answer"].lower() or "no amenities" in body["answer"].lower()
    assert not any(
        source.get("id") == "not-a-real-unit" for source in body["sources"]
    )
