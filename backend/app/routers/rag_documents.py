from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.rag.document_ingest import ingest_document


router = APIRouter(
    prefix="/api/v1/rag",
    tags=["rag"],
)


class DocumentIngestRequest(BaseModel):
    property_id: str
    unit_listing_id: str
    title: str = Field(..., min_length=1, max_length=255)
    document_type: str = Field(..., min_length=1, max_length=100)
    content: str = Field(..., min_length=1)


@router.post("/documents")
def create_rag_document(
    payload: DocumentIngestRequest,
):
    try:
        return ingest_document(
            property_id=payload.property_id,
            unit_listing_id=payload.unit_listing_id,
            title=payload.title,
            document_type=payload.document_type,
            content=payload.content,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Document ingestion failed: {exc}",
        ) from exc