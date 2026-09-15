from tests.factories import make_guest, make_property_guest_plan


def test_list_guests_returns_all(client, db_session):
    _property, guest, _rate_plan = make_property_guest_plan(db_session)

    resp = client.get("/api/v1/guests")
    assert resp.status_code == 200
    body = resp.json()
    assert len(body) == 1
    assert body[0]["id"] == guest.id
    assert body[0]["email"] == "test@example.com"


def test_list_guests_search_filters_by_name(client, db_session):
    _property, _guest, _rate_plan = make_property_guest_plan(db_session)
    make_guest(db_session, name="Amara Patel", email="amara@example.com")
    db_session.commit()

    resp = client.get("/api/v1/guests", params={"search": "amara"})
    assert resp.status_code == 200
    body = resp.json()
    assert len(body) == 1
    assert body[0]["email"] == "amara@example.com"


def test_list_guests_search_filters_by_email(client, db_session):
    _property, _guest, _rate_plan = make_property_guest_plan(db_session)
    make_guest(db_session, name="Amara Patel", email="amara@example.com")
    db_session.commit()

    resp = client.get("/api/v1/guests", params={"search": "test@example.com"})
    assert resp.status_code == 200
    assert len(resp.json()) == 1


def test_list_guests_search_no_match_returns_empty(client, db_session):
    make_property_guest_plan(db_session)

    resp = client.get("/api/v1/guests", params={"search": "nobody"})
    assert resp.status_code == 200
    assert resp.json() == []
