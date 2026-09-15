from app.rag.generator import generate_answer
from app.rag.service import retrieve_context


def answer_question(
    question: str,
    property_id: str,
    unit_listing_id: str | None = None,
    extra_context: list[dict] | None = None,
):
    """
    Run the complete RAG pipeline.

    1. Retrieve relevant property/unit knowledge from pgvector.
    2. Add optional guest-specific context.
    3. Generate a grounded answer.
    4. Return the answer together with its sources.
    """

    context = retrieve_context(
        question=question,
        property_id=property_id,
        unit_listing_id=unit_listing_id,
    )

    if extra_context:
        context.extend(extra_context)

    answer = generate_answer(
        question=question,
        context=context,
    )

    sources = [
        {
            "type": item.get("type", "rag_chunk"),
            "document_id": item.get("document_id"),
            "unit_listing_id": item.get("unit_listing_id"),
            "content": item.get("content"),
            "distance": item.get("distance"),
        }
        for item in context
    ]

    return {
        "answer": answer,
        "sources": sources,
    }