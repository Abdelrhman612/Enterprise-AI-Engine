from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"status": "Running", "message": "FastAPI شغال تمام وبدون مشاكل! 🚀"}


@app.get("/ask")
def ask_question(question: str):
    return {
        "user_question": question,
        "ai_response": f"تم استقبال سؤالك: '{question}'. السيرفر جاهز للربط مع باقي المشروع!"
    }