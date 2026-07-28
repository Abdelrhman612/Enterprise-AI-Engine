import asyncio
from dataclasses import dataclass
from typing import Any, List

from langchain.docstore.document import Document
from langchain.embeddings import OllamaEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import FAISS


@dataclass
class VectorStoreService:
    embedding_model: str
    ollama_api_url: str
    chunk_size: int
    chunk_overlap: int

    def __post_init__(self) -> None:
        self._embeddings = OllamaEmbeddings(
            model=self.embedding_model,
            base_url=self.ollama_api_url,
        )
        self._text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=self.chunk_size,
            chunk_overlap=self.chunk_overlap,
            separators=["\n\n", "\n", " ", ""],
        )
        self._vector_store: FAISS | None = None

    def has_documents(self) -> bool:
        return self._vector_store is not None

    def add_documents(self, texts: List[str], metadatas: List[dict[str, Any]]) -> int:
        documents = [Document(page_content=text, metadata=meta) for text, meta in zip(texts, metadatas)]
        split_documents = self._text_splitter.split_documents(documents)
        if self._vector_store is None:
            self._vector_store = FAISS.from_documents(split_documents, self._embeddings)
        else:
            self._vector_store.add_documents(split_documents)
        return len(split_documents)

    async def add_documents_async(self, texts: List[str], metadatas: List[dict[str, Any]]) -> int:
        return await asyncio.to_thread(self.add_documents, texts, metadatas)

    def search(self, query: str, top_k: int) -> List[dict[str, Any]]:
        if self._vector_store is None:
            return []
        hits = self._vector_store.similarity_search_with_score(query, k=top_k)
        return [
            {
                "content": document.page_content,
                "metadata": document.metadata or {},
                "score": float(score),
            }
            for document, score in hits
        ]

    async def search_async(self, query: str, top_k: int) -> List[dict[str, Any]]:
        return await asyncio.to_thread(self.search, query, top_k)
