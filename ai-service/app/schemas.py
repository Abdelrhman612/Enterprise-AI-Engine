from pydantic import BaseModel
from typing import Any, List, Optional


class UploadResponse(BaseModel):
    success: bool
    file_count: int
    total_chunks: int
    message: str


class AskPayload(BaseModel):
    query: str
    session_id: Optional[str] = None
    top_k: Optional[int] = None


class SourceDocument(BaseModel):
    content: str
    metadata: dict[str, Any]
    score: float


class AskResponse(BaseModel):
    answer: str
    sources: List[SourceDocument]
    search_query: str
