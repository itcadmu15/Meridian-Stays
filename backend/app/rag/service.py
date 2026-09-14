from app.rag.embeddings import create_embedding
from app.rag.retriever import search_similar_chunks


def retrieve_context(
    question: str,
    property_id: str,
    unit_listing_id: str | None = None,
):
    query_embedding = create_embedding(question)

    chunks = search_similar_chunks(
        query_embedding=query_embedding,
        property_id=property_id,
        unit_listing_id=unit_listing_id,
        limit=5,
    )

    context = []

    for chunk in chunks:
        context.append(
            {
                "content": chunk["content"],
                "distance": float(chunk["distance"]),
                "document_id": str(chunk["document_id"]),
                "unit_listing_id": (
                    str(chunk["unit_listing_id"])
                    if chunk["unit_listing_id"]
                    else None
                ),
            }
        )

    return context