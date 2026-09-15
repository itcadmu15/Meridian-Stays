from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, schemas
from app.database import get_db

router = APIRouter(prefix="/api/v1/owners", tags=["owners"])


@router.get("/{owner_id}", response_model=schemas.OwnerAccountDetail)
def get_owner(owner_id: str, db: Session = Depends(get_db)):
    owner = crud.get_owner_account(db, owner_id)
    if not owner:
        raise HTTPException(status_code=404, detail="Owner not found")
    return owner


@router.patch("/{owner_id}", response_model=schemas.OwnerAccountOut)
def update_owner(owner_id: str, payload: schemas.OwnerAccountUpdate, db: Session = Depends(get_db)):
    owner = crud.get_owner_account(db, owner_id)
    if not owner:
        raise HTTPException(status_code=404, detail="Owner not found")

    if payload.email:
        existing = crud.get_owner_by_email(db, payload.email)
        if existing and existing.id != owner_id:
            raise HTTPException(status_code=409, detail="Email already exists")

    return crud.update_owner_account(db, owner, payload)


@router.get("/{owner_id}/properties", response_model=list[schemas.PropertyOut])
def get_owner_properties(owner_id: str, db: Session = Depends(get_db)):
    owner = crud.get_owner_account(db, owner_id)
    if not owner:
        raise HTTPException(status_code=404, detail="Owner not found")
    return crud.get_owner_properties(db, owner_id)