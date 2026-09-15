"""Pydantic request/response schemas mirroring the Core Data Model and API contract."""
from decimal import Decimal
from datetime import datetime
from datetime import date
from pydantic import BaseModel, ConfigDict, field_validator
from app.models import CleaningTaskStatus
from pydantic import BaseModel, ConfigDict, EmailStr

from app.models import FolioStatus, ReservationStatus
from uuid import UUID
# ---- Guest ----


class GuestOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    email: EmailStr
    phone: str | None = None
    loyalty_tier: str
    created_at: datetime


class GuestPreferences(BaseModel):
    dietary: list[str] = []
    room_preferences: list[str] = []
    notes: list[str] = []


class GuestDetail(GuestOut):
    preferences: GuestPreferences


# ---- Property / RatePlan ----
# Not exposed via their own endpoints yet (not in the Section 2.3 contract) — kept
# here so team briefs that add e.g. a properties list endpoint can reuse them.


class PropertyOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    brand: str
    address: str | None = None
    timezone: str


class RatePlanOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    property_id: str
    name: str
    nightly_rate: Decimal
    cancellation_policy: str | None = None


# ---- Reservation / Folio ----


class ReservationCreate(BaseModel):
    guest_id: str
    property_id: str
    rate_plan_id: str | None = None
    check_in: date
    check_out: date
    status: ReservationStatus = ReservationStatus.confirmed


class ReservationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    guest_id: str
    property_id: str
    rate_plan_id: str | None = None
    check_in: date
    check_out: date
    status: ReservationStatus


class FolioOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    reservation_id: str
    line_items: list[dict]
    balance: Decimal
    status: FolioStatus


class ReservationDetail(ReservationOut):
    guest: GuestOut
    folio: FolioOut | None = None


# ---- Availability ----


class AvailabilitySlot(BaseModel):
    rate_plan_id: str
    rate_plan_name: str
    nightly_rate: Decimal
    capacity: int
    booked: int
    available: bool



from pydantic import BaseModel, Field, field_validator
class UnitListingBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=150)
    description: str | None = None
    location: str | None = None

    nightly_rate: Decimal = Field(..., ge=0)

    status: str = Field(default="active")

    amenities: list[str] = Field(default_factory=list)

    check_in_time: str | None = None
    check_out_time: str | None = None

    listing_documents: list[dict] = Field(default_factory=list)

    property_id: str | None = None

    @field_validator("status")
    @classmethod
    def validate_status(cls, value: str) -> str:
        allowed = {"active", "inactive", "draft"}

        if value not in allowed:
            raise ValueError(
                f"status must be one of: {', '.join(sorted(allowed))}"
            )

        return value


class UnitListingCreate(UnitListingBase):
    pass


class UnitListingUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=150)
    description: str | None = None
    location: str | None = None

    nightly_rate: Decimal | None = Field(None, ge=0)

    status: str | None = None

    amenities: list[str] | None = None

    check_in_time: str | None = None
    check_out_time: str | None = None

    listing_documents: list[dict] | None = None

    property_id: UUID | None = None

    @field_validator("status")
    @classmethod
    def validate_status(cls, value: str | None) -> str | None:
        if value is None:
            return value

        allowed = {"active", "inactive", "draft"}

        if value not in allowed:
            raise ValueError(
                f"status must be one of: {', '.join(sorted(allowed))}"
            )

        return value


class UnitListingResponse(UnitListingBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True
    }





class CleaningTaskCreate(BaseModel):
    unit_id: str
    turnover_start: datetime
    turnover_end: datetime
    assigned_vendor: str | None = None
    status: CleaningTaskStatus = CleaningTaskStatus.scheduled

    @field_validator("turnover_end")
    @classmethod
    def validate_turnover_window(cls, value, info):
        start = info.data.get("turnover_start")
        if start and value <= start:
            raise ValueError("turnover_end must be after turnover_start")
        return value


class CleaningTaskUpdate(BaseModel):
    unit_id: str | None = None
    turnover_start: datetime | None = None
    turnover_end: datetime | None = None
    assigned_vendor: str | None = None
    status: CleaningTaskStatus | None = None


class CleaningTaskResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    unit_id: str
    turnover_start: datetime
    turnover_end: datetime
    assigned_vendor: str | None
    status: CleaningTaskStatus
    created_at: datetime
    updated_at: datetime