from app.rag.generator import generate_answer
from app.rag.service import retrieve_context


def answer_question(
    question: str,
    property_id: str,
    unit_listing_id: str | None = None,
):
    context = retrieve_context(
        question=question,
        property_id=property_id,
        unit_listing_id=unit_listing_id,
    )

    answer = generate_answer(
        question=question,
        context=context,
    )

    sources = [
        {
            "document_id": item["document_id"],
            "unit_listing_id": item["unit_listing_id"],
            "content": item["content"],
            "distance": item["distance"],
        }
        for item in context
    ]

    return {
        "answer": answer,
        "sources": sources,
    }
