from app.database import SessionLocal
from app.models import Property, UnitListing, RagDocument, RagChunk
from app.rag.chunker import chunk_text
from app.rag.embeddings import create_embedding


def ingest_document(
    property_id: str,
    unit_listing_id: str,
    title: str,
    document_type: str,
    content: str,
):
    """
    Store a document and its vectorized chunks for a specific
    property and unit listing.
    """

    db = SessionLocal()

    try:
        # ---------------------------------------------------------
        # VALIDATE PROPERTY
        # ---------------------------------------------------------

        property_obj = (
            db.query(Property)
            .filter(Property.id == str(property_id))
            .first()
        )

        if not property_obj:
            raise ValueError("Property not found")

        # ---------------------------------------------------------
        # VALIDATE UNIT LISTING
        # ---------------------------------------------------------

        unit = (
            db.query(UnitListing)
            .filter(UnitListing.id == str(unit_listing_id))
            .first()
        )

        if not unit:
            raise ValueError("Unit listing not found")

        # Make sure the unit belongs to the requested property.
        if str(unit.property_id) != str(property_obj.id):
            raise ValueError(
                "Unit listing does not belong to this property"
            )

        # ---------------------------------------------------------
        # VALIDATE CONTENT
        # ---------------------------------------------------------

        content = content.strip()

        if not content:
            raise ValueError("Document content cannot be empty")

        # ---------------------------------------------------------
        # CREATE RAG DOCUMENT
        # ---------------------------------------------------------

        document = RagDocument(
            property_id=str(property_obj.id),
            unit_listing_id=str(unit.id),
            title=title,
            document_type=document_type,
            content=content,
        )

        db.add(document)
        db.flush()

        # ---------------------------------------------------------
        # CHUNK DOCUMENT
        # ---------------------------------------------------------

        chunks = chunk_text(content)

        if not chunks:
            raise ValueError("Document produced no chunks")

        # ---------------------------------------------------------
        # CREATE EMBEDDINGS + RAG CHUNKS
        # ---------------------------------------------------------

        for chunk_content in chunks:

            embedding = create_embedding(chunk_content)

            chunk = RagChunk(
                document_id=str(document.id),
                property_id=str(property_obj.id),
                unit_listing_id=str(unit.id),
                content=chunk_content,
                embedding=embedding,
            )

            db.add(chunk)

        # ---------------------------------------------------------
        # SAVE
        # ---------------------------------------------------------

        db.commit()
        db.refresh(document)

        return {
            "document_id": str(document.id),
            "property_id": str(property_obj.id),
            "unit_listing_id": str(unit.id),
            "title": document.title,
            "document_type": document.document_type,
            "chunks_created": len(chunks),
        }

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()