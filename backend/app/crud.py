"""Plain DB access functions, kept separate from routers so they're easy to reuse
(e.g. from the AI agent/RAG code teams build in Sprint 3) and to unit test."""
from app.models import CleaningTask, CleaningTaskStatus, UnitListing
from app.schemas import CleaningTaskCreate, CleaningTaskUpdate

from datetime import datetime
from datetime import date
from uuid import UUID

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


def get_cleaning_task(db: Session, task_id: str):
    return (
        db.query(CleaningTask)
        .filter(CleaningTask.id == task_id)
        .first()
    )


def list_cleaning_tasks(
    db: Session,
    unit_id: str | None = None,
    status: CleaningTaskStatus | None = None,
    date_from: datetime | None = None,
    date_to: datetime | None = None,
):
    query = db.query(CleaningTask)

    if unit_id:
        query = query.filter(CleaningTask.unit_id == unit_id)

    if status:
        query = query.filter(CleaningTask.status == status)

    if date_from:
        query = query.filter(CleaningTask.turnover_end >= date_from)

    if date_to:
        query = query.filter(CleaningTask.turnover_start <= date_to)

    return query.order_by(CleaningTask.turnover_start.asc()).all()


def cleaning_task_conflict(
    db: Session,
    unit_id: str,
    turnover_start: datetime,
    turnover_end: datetime,
    exclude_task_id: str | None = None,
):
    query = db.query(CleaningTask).filter(
        CleaningTask.unit_id == unit_id,
        CleaningTask.status != CleaningTaskStatus.cancelled,
        CleaningTask.turnover_start < turnover_end,
        CleaningTask.turnover_end > turnover_start,
    )

    if exclude_task_id:
        query = query.filter(CleaningTask.id != exclude_task_id)

    return query.first()


def create_cleaning_task(
    db: Session,
    task: CleaningTaskCreate,
):
    unit = (
        db.query(UnitListing)
        .filter(UnitListing.id == task.unit_id)
        .first()
    )

    if not unit:
        raise ValueError("Unit listing not found")

    conflict = cleaning_task_conflict(
        db,
        task.unit_id,
        task.turnover_start,
        task.turnover_end,
    )

    if conflict:
        raise ValueError("Cleaning task conflicts with an existing task")

    db_task = CleaningTask(
        unit_id=task.unit_id,
        turnover_start=task.turnover_start,
        turnover_end=task.turnover_end,
        assigned_vendor=task.assigned_vendor,
        status=task.status,
    )

    db.add(db_task)
    db.commit()
    db.refresh(db_task)

    return db_task


def update_cleaning_task(
    db: Session,
    task_id: str,
    task: CleaningTaskUpdate,
):
    db_task = get_cleaning_task(db, task_id)

    if not db_task:
        raise ValueError("Cleaning task not found")

    data = task.model_dump(exclude_unset=True)

    unit_id = data.get("unit_id", db_task.unit_id)
    turnover_start = data.get(
        "turnover_start",
        db_task.turnover_start,
    )
    turnover_end = data.get(
        "turnover_end",
        db_task.turnover_end,
    )

    if turnover_end <= turnover_start:
        raise ValueError("turnover_end must be after turnover_start")

    unit = (
        db.query(UnitListing)
        .filter(UnitListing.id == unit_id)
        .first()
    )

    if not unit:
        raise ValueError("Unit listing not found")

    conflict = cleaning_task_conflict(
        db,
        unit_id,
        turnover_start,
        turnover_end,
        exclude_task_id=task_id,
    )

    if conflict:
        raise ValueError("Cleaning task conflicts with an existing task")

    for key, value in data.items():
        setattr(db_task, key, value)

    db.commit()
    db.refresh(db_task)

    return db_task


def delete_cleaning_task(
    db: Session,
    task_id: str,
):
    db_task = get_cleaning_task(db, task_id)

    if not db_task:
        raise ValueError("Cleaning task not found")

    db.delete(db_task)
    db.commit()

    return db_task