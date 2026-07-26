from fastapi import FastAPI
from pydantic import BaseModel



app = FastAPI()

# 1. Define the Request DTO (Data Transfer Object) using Pydantic
class ChatRequest(BaseModel):
    message: str

@app.get("/")
def read_root():
    return {"Purpose": "This is a FastAPI application that serves as an AI service."}

# 2. Define the POST endpoint to receive chat messages
@app.post("/chat")
def chat(request: ChatRequest):
    # For Sprint 1, we hardcode the response.
    # Later, this is where we will invoke LangChain/LLMs.
    return {
        "response": f"Hello from AI Service (received: '{request.message}')"
    }
