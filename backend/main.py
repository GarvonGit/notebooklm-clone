from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import fitz  # PyMuPDF
import requests

app = FastAPI()

# ---------- CORS Setup ----------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to your frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- PDF Upload ----------
@app.post("/upload-pdf/")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

    try:
        contents = await file.read()
        doc = fitz.open(stream=contents, filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text()
        doc.close()
        return {"text": text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading PDF: {str(e)}")

# ---------- Chat Request Model ----------
class ChatRequest(BaseModel):
    question: str
    context: str

# ---------- Chat Endpoint using TinyLlama ----------
@app.post("/chat/")
def chat_with_pdf(request: ChatRequest):
    ollama_url = "https://bd147b55c8c9.ngrok-free.app/api/generate"

    payload = {
        "model": "tinyllama",  # ✅ using TinyLlama model
        "prompt": f"Context:\n{request.context}\n\nQuestion: {request.question}",
        "stream": False
    }

    try:
        response = requests.post(ollama_url, json=payload)
        response.raise_for_status()
        result = response.json()

        if "response" not in result:
            raise HTTPException(status_code=500, detail="Invalid response from LLM.")

        return {"response": result["response"]}
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"LLM request failed: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
