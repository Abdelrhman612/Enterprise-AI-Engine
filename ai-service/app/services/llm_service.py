from langchain.chat_models import ChatGroq
from langchain.schema import HumanMessage, SystemMessage


class LLMService:
    def __init__(self, model_name: str, ollama_api_url: str) -> None:
        self._client = ChatGroq(
            model=model_name,
            base_url=ollama_api_url,
            temperature=0.0,
            max_tokens=1024,
        )

    async def generate_answer(self, query: str, context: str) -> str:
        prompt = [
            SystemMessage(
                content=(
                    "You are an enterprise AI assistant. Answer the query using the provided source documents. "
                    "Keep the response concise, accurate, and mention source metadata when available."
                )
            ),
            HumanMessage(
                content=(
                    "User question:\n" + query + "\n\n" + "Source content:\n" + context + "\n\n"
                    "Provide a final answer and cite the source names where possible."
                )
            ),
        ]
        response = await self._client.agenerate([prompt])
        if response.generations and response.generations[0]:
            return response.generations[0][0].text.strip()
        return "I could not generate an answer at this time."
