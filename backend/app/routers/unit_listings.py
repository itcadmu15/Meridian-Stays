from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.crud import (
    create_unit_listing,
    delete_unit_listing,
    get_unit_listing,
    get_unit_listings,
    update_unit_listing,
)
from app.database import get_db
from app.schemas import (
    UnitListingCreate,
    UnitListingResponse,
    UnitListingUpdate,
)

router = APIRouter(
    prefix="/api/v1/unit-listings",
    tags=["unit-listings"],
)


@router.get(
    "",
    response_model=list[UnitListingResponse],
)
def list_unit_listings(
    status_filter: str | None = Query(
        default=None,
        alias="status",
    ),
    skip: int = 0,
    limit: int = Query(default=100, le=100),
    db: Session = Depends(get_db),
):
    return get_unit_listings(
        db=db,
        skip=skip,
        limit=limit,
        status=status_filter,
    )


@router.get(
    "/{unit_id}",
    response_model=UnitListingResponse,
)
def read_unit_listing(
    unit_id: UUID,
    db: Session = Depends(get_db),
):
    listing = get_unit_listing(
        db=db,
        unit_id=unit_id,
    )

    if not listing:
        raise HTTPException(
            status_code=404,
            detail="Unit listing not found",
        )

    return listing


@router.post(
    "",
    response_model=UnitListingResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_listing(
    listing: UnitListingCreate,
    db: Session = Depends(get_db),
):
    return create_unit_listing(
        db=db,
        listing=listing,
    )


@router.patch(
    "/{unit_id}",
    response_model=UnitListingResponse,
)
def update_listing(
    unit_id: UUID,
    listing: UnitListingUpdate,
    db: Session = Depends(get_db),
):
    updated_listing = update_unit_listing(
        db=db,
        unit_id=unit_id,
        listing=listing,
    )

    if not updated_listing:
        raise HTTPException(
            status_code=404,
            detail="Unit listing not found",
        )

    return updated_listing


@router.delete(
    "/{unit_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def remove_listing(
    unit_id: UUID,
    db: Session = Depends(get_db),
):
    deleted_listing = delete_unit_listing(
        db=db,
        unit_id=unit_id,
    )

    if not deleted_listing:
        raise HTTPException(
            status_code=404,
            detail="Unit listing not found",
        )

    return None