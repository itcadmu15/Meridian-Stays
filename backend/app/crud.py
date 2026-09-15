"""Plain DB access functions, kept separate from routers so they're easy to reuse
(e.g. from the AI agent/RAG code teams build in Sprint 3) and to unit test."""

from datetime import date
from uuid import UUID

from sqlalchemy import or_
from sqlalchemy.orm import Session

from app import models, schemas
from app.models import UnitListing
from app.schemas import (
    UnitListingCreate,
    UnitListingUpdate,
)


def list_reservations(
    db: Session,
    property_id: str | None = None,
    status: models.ReservationStatus | None = None,
    date_from: date | None = None,
    date_to: date | None = None,
):
    query = db.query(models.Reservation)
    if property_id:
        query = query.filter(models.Reservation.property_id == property_id)
    if status:
        query = query.filter(models.Reservation.status == status)
    if date_from:
        query = query.filter(models.Reservation.check_out >= date_from)
    if date_to:
        query = query.filter(models.Reservation.check_in <= date_to)
    return query.order_by(models.Reservation.check_in).all()


def get_reservation(db: Session, reservation_id: str) -> models.Reservation | None:
    return db.query(models.Reservation).filter(models.Reservation.id == reservation_id).first()


def create_reservation(db: Session, payload: schemas.ReservationCreate) -> models.Reservation:
    reservation = models.Reservation(**payload.model_dump())
    db.add(reservation)
    db.commit()
    db.refresh(reservation)
    return reservation


def get_guest(db: Session, guest_id: str) -> models.Guest | None:
    return db.query(models.Guest).filter(models.Guest.id == guest_id).first()


def list_guests(
    db: Session,
    search: str | None = None,
    skip: int = 0,
    limit: int = 100,
):
    """List guests newest-first, with an optional case-insensitive name/email search."""
    query = db.query(models.Guest)

    if search:
        pattern = f"%{search}%"
        query = query.filter(
            or_(models.Guest.name.ilike(pattern), models.Guest.email.ilike(pattern))
        )

    return (
        query
        .order_by(models.Guest.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_folio(db: Session, folio_id: str) -> models.Folio | None:
    return db.query(models.Folio).filter(models.Folio.id == folio_id).first()


def get_rate_plans_for_property(db: Session, property_id: str) -> list[models.RatePlan]:
    return db.query(models.RatePlan).filter(models.RatePlan.property_id == property_id).all()


def count_overlapping_reservations(
    db: Session, rate_plan_id: str, check_in: date, check_out: date
) -> int:
    return (
        db.query(models.Reservation)
        .filter(
            models.Reservation.rate_plan_id == rate_plan_id,
            models.Reservation.status != models.ReservationStatus.cancelled,
            models.Reservation.check_in < check_out,
            models.Reservation.check_out > check_in,
        )
        .count()
    )


def get_unit_listings(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    status: str | None = None,
):
    query = db.query(UnitListing)

    if status:
        query = query.filter(UnitListing.status == status)

    return (
        query
        .order_by(UnitListing.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_unit_listing(
    db: Session,
    unit_id: str | UUID,
):
    # UnitListing.id is a String(36) column. Comparing it against a UUID object
    # makes Postgres raise `varchar = uuid` (HTTP 500), so normalize to a string
    # here. str() also covers str inputs, and SQLAlchemy handles both dialects.
    return (
        db.query(UnitListing)
        .filter(UnitListing.id == str(unit_id))
        .first()
    )


def create_unit_listing(
    db: Session,
    listing: UnitListingCreate,
):
    db_listing = UnitListing(
        **listing.model_dump()
    )

    db.add(db_listing)
    db.commit()
    db.refresh(db_listing)

    return db_listing


def update_unit_listing(
    db: Session,
    unit_id: str | UUID,
    listing: UnitListingUpdate,
):
    db_listing = get_unit_listing(db, unit_id)

    if not db_listing:
        return None

    update_data = listing.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(db_listing, field, value)

    db.commit()
    db.refresh(db_listing)

    return db_listing


def delete_unit_listing(
    db: Session,
    unit_id: str | UUID,
):
    db_listing = get_unit_listing(db, unit_id)

    if not db_listing:
        return None

    db.delete(db_listing)
    db.commit()

    return db_listing