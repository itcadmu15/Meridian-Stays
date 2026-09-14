from openai import OpenAI

from app.config import settings


def generate_answer(
    question: str,
    context: list[dict],
) -> str:

    if not context:
        return (
            "I don't have enough information in the property "
            "knowledge base to answer that question."
        )

    client = OpenAI(api_key=settings.openai_api_key)

    context_text = "\n\n".join(
        item["content"]
        for item in context
    )

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are the Meridian Stays guest assistant. "
                    "Answer only using the provided property "
                    "information. Do not invent information. "
                    "If the answer is not contained in the context, "
                    "say that the information is unavailable."
                ),
            },
            {
                "role": "user",
                "content": (
                    f"Property information:\n\n"
                    f"{context_text}\n\n"
                    f"Guest question:\n{question}"
                ),
            },
        ],
        temperature=0,
    )

    return response.choices[0].message.content or (
        "I couldn't generate an answer from the available information."
    )