from pydantic import BaseSettings


class AiSettings(BaseSettings):
    ollama_api_url: str = "http://localhost:11434"
    ollama_embedding_model: str = "nomic-embed-text"
    chat_groq_model: str = "gpt-4o-mini"
    chunk_size: int = 1000
    chunk_overlap: int = 200
    search_top_k: int = 5
    cors_origins: list[str] = ["*"]

    class Config:
        env_prefix = "AI_"
        case_sensitive = False
