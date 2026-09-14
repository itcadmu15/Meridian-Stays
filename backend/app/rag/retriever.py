from sqlalchemy import text

from app.database import SessionLocal


def search_similar_chunks(
    query_embedding: list[float],
    property_id: str,
    unit_listing_id: str | None = None,
    limit: int = 5,
):
    db = SessionLocal()

    try:
        embedding_string = "[" + ",".join(
            str(value) for value in query_embedding
        ) + "]"

        if unit_listing_id:
            sql = text(
                """
                SELECT
                    id,
                    document_id,
                    property_id,
                    unit_listing_id,
                    content,
                    embedding <=> CAST(:embedding AS vector) AS distance
                FROM rag_chunks
                WHERE property_id = :property_id
                  AND unit_listing_id = :unit_listing_id
                ORDER BY embedding <=> CAST(:embedding AS vector)
                LIMIT :limit
                """
            )

            params = {
                "embedding": embedding_string,
                "property_id": property_id,
                "unit_listing_id": unit_listing_id,
                "limit": limit,
            }

        else:
            sql = text(
                """
                SELECT
                    id,
                    document_id,
                    property_id,
                    unit_listing_id,
                    content,
                    embedding <=> CAST(:embedding AS vector) AS distance
                FROM rag_chunks
                WHERE property_id = :property_id
                ORDER BY embedding <=> CAST(:embedding AS vector)
                LIMIT :limit
                """
            )

            params = {
                "embedding": embedding_string,
                "property_id": property_id,
                "limit": limit,
            }

        rows = db.execute(sql, params).mappings().all()

        return [dict(row) for row in rows]

    finally:
        db.close()