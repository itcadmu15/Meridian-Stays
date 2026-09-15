from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app import crud
from app.database import get_db
from app.models import CleaningTaskStatus
from app.schemas import (
    CleaningTaskCreate,
    CleaningTaskResponse,
    CleaningTaskUpdate,
)

router = APIRouter(
    prefix="/api/v1/cleaning-tasks",
    tags=["Cleaning Tasks"],
)


@router.get("", response_model=list[CleaningTaskResponse])
def get_cleaning_tasks(
    unit_id: str | None = None,
    status: CleaningTaskStatus | None = None,
    date_from: datetime | None = Query(None),
    date_to: datetime | None = Query(None),
    db: Session = Depends(get_db),
):
    return crud.list_cleaning_tasks(
        db,
        unit_id=unit_id,
        status=status,
        date_from=date_from,
        date_to=date_to,
    )


@router.get("/{task_id}", response_model=CleaningTaskResponse)
def get_cleaning_task(
    task_id: str,
    db: Session = Depends(get_db),
):
    task = crud.get_cleaning_task(db, task_id)

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Cleaning task not found",
        )

    return task


@router.post(
    "",
    response_model=CleaningTaskResponse,
    status_code=201,
)
def create_cleaning_task(
    task: CleaningTaskCreate,
    db: Session = Depends(get_db),
):
    try:
        return crud.create_cleaning_task(db, task)
    except ValueError as exc:
        message = str(exc)

        if "conflicts" in message:
            raise HTTPException(
                status_code=409,
                detail=message,
            )

        raise HTTPException(
            status_code=404,
            detail=message,
        )


@router.patch(
    "/{task_id}",
    response_model=CleaningTaskResponse,
)
def update_cleaning_task(
    task_id: str,
    task: CleaningTaskUpdate,
    db: Session = Depends(get_db),
):
    try:
        return crud.update_cleaning_task(
            db,
            task_id,
            task,
        )
    except ValueError as exc:
        message = str(exc)

        if "conflicts" in message:
            raise HTTPException(
                status_code=409,
                detail=message,
            )

        if "must be after" in message:
            raise HTTPException(
                status_code=422,
                detail=message,
            )

        raise HTTPException(
            status_code=404,
            detail=message,
        )


@router.delete(
    "/{task_id}",
    status_code=204,
)
def delete_cleaning_task(
    task_id: str,
    db: Session = Depends(get_db),
):
    try:
        crud.delete_cleaning_task(db, task_id)
    except ValueError as exc:
        raise HTTPException(
            status_code=404,
            detail=str(exc),
        )