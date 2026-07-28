import logging
from typing import List

from fastapi import FastAPI, File, HTTPException, Request, UploadFile, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .schemas import AskPayload, AskResponse, SourceDocument, UploadResponse
from .services.llm_service import LLMService
from .services.vector_store import VectorStoreService
from .settings import AiSettings

logger = logging.getLogger("enterprise_ai_engine")


def create_app() -> FastAPI:
    settings = AiSettings()
    app = FastAPI(
        title="Enterprise AI Engine",
        version="1.0.0",
        description="Local AI service for enterprise RAG with ultra-fast Groq inference and Ollama embeddings.",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "OPTIONS"],
        allow_headers=["*"],
    )

    vector_store = VectorStoreService(
        embedding_model=settings.ollama_embedding_model,
        ollama_api_url=settings.ollama_api_url,
        chunk_size=settings.chunk_size,
        chunk_overlap=settings.chunk_overlap,
    )
    llm_service = LLMService(
        model_name=settings.chat_groq_model,
        ollama_api_url=settings.ollama_api_url,
    )

    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
        logger.exception("Unhandled exception in AI service: %s", exc)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "success": False,
                "error": "Internal server error. Please review logs for more details.",
            },
        )

    @app.post("/upload", response_model=UploadResponse)
    async def upload(files: List[UploadFile] = File(...)) -> UploadResponse:
        if not files:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Upload requires at least one file.")

        texts: list[str] = []
        metadatas: list[dict[str, str]] = []

        for upload_file in files:
            raw_bytes = await upload_file.read()
            try:
                text = raw_bytes.decode("utf-8")
            except UnicodeDecodeError:
                text = raw_bytes.decode("latin-1", errors="replace")

            texts.append(text)
            metadatas.append(
                {
                    "filename": upload_file.filename,
                    "content_type": upload_file.content_type or "application/octet-stream",
                }
            )

        total_chunks = await vector_store.add_documents_async(texts, metadatas)
        return UploadResponse(
            success=True,
            file_count=len(files),
            total_chunks=total_chunks,
            message=f"Indexed {len(files)} file(s) into {total_chunks} embedding chunks.",
        )

    @app.post("/ask", response_model=AskResponse)
    async def ask(payload: AskPayload) -> AskResponse:
        if not payload.query.strip():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Query text cannot be empty.")

        if not vector_store.has_documents():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No documents are indexed. Upload content before asking questions.",
            )

        top_k = payload.top_k or settings.search_top_k
        search_results = await vector_store.search_async(payload.query, top_k)

        if not search_results:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No matching documents were found for your query.",
            )

        context = "\n\n".join(
            [f"[{idx + 1}] {item['metadata'].get('filename', 'source')}:\n{item['content']}" for idx, item in enumerate(search_results)]
        )

        answer = await llm_service.generate_answer(payload.query, context)
        sources = [
            SourceDocument(content=item["content"], metadata=item["metadata"], score=item["score"])
            for item in search_results
        ]

        return AskResponse(answer=answer, sources=sources, search_query=payload.query)

    return app
