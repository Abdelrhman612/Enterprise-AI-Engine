from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"Purpose": "This is a FastAPI application that serves as an AI service."}


