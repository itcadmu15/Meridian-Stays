from app.database import SessionLocal
from app.models import Property, UnitListing, RagDocument, RagChunk
from app.rag.chunker import chunk_text
from app.rag.embeddings import create_embedding


def build_unit_knowledge(property_obj, unit):
    amenities = ", ".join(unit.amenities or [])

    return f"""
Property: {property_obj.name}
Brand: {property_obj.brand}
Address: {property_obj.address or "Not provided"}

Unit Listing: {unit.name}
Description: {unit.description or "Not provided"}
Location: {unit.location or "Not provided"}
Nightly Rate: {unit.nightly_rate}
Status: {unit.status}
Amenities: {amenities or "Not provided"}
Check-in Time: {unit.check_in_time or "Not provided"}
Check-out Time: {unit.check_out_time or "Not provided"}
""".strip()


def ingest_unit(unit, property_obj):
    db = SessionLocal()

    try:
        content = build_unit_knowledge(property_obj, unit)

        document = RagDocument(
            property_id=property_obj.id,
            unit_listing_id=unit.id,
            title=f"{unit.name} Knowledge",
            document_type="unit_listing",
            content=content,
        )

        db.add(document)
        db.flush()

        chunks = chunk_text(content)

        for chunk_content in chunks:
            embedding = create_embedding(chunk_content)

            chunk = RagChunk(
                document_id=document.id,
                property_id=property_obj.id,
                unit_listing_id=unit.id,
                content=chunk_content,
                embedding=embedding,
            )

            db.add(chunk)

        db.commit()

        print(
            f"Indexed: {unit.name} "
            f"({len(chunks)} chunks)"
        )

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


def main():
    db = SessionLocal()

    try:
        units = db.query(UnitListing).all()

        if not units:
            print("No unit listings found.")
            return

        for unit in units:
            if not unit.property_id:
                print(
                    f"Skipping {unit.name}: "
                    "no property_id"
                )
                continue

            property_obj = (
                db.query(Property)
                .filter(Property.id == unit.property_id)
                .first()
            )

            if not property_obj:
                print(
                    f"Skipping {unit.name}: "
                    "property not found"
                )
                continue

            ingest_unit(unit, property_obj)

    finally:
        db.close()


if __name__ == "__main__":
    main()