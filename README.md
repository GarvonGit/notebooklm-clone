
# 🧠 NotebookLM Clone

A lightweight web-based application that allows users to upload and interact with PDF documents through a chat interface powered by a local TinyLLaMA model via Ollama. Built using **React** (Frontend), **FastAPI** (Backend), and **Ollama** (LLM runtime).

---

## 🚀 Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/notebooklm-clone.git
cd notebooklm-clone
```

---

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

### 3. Backend Setup

```bash
cd ../backend
python -m venv venv
# For Windows:
venv\Scripts\activate
# For macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

---

### 4. Start TinyLLaMA (via Ollama)

Install Ollama from: https://ollama.com

Then run:

```bash
ollama pull tinyllama
ollama run tinyllama
```

---

## 🌐 Deployment on Render

- **Frontend**: Deploy the static build from `frontend/dist`
- **Backend**: Deploy FastAPI server from the `backend` folder
- **TinyLLaMA**: Must run locally or on a GPU-enabled cloud instance (Render does not support GPU inference)

---

## 📁 Folder Structure

```
notebooklm-clone/
├── backend/
│   └── main.py
├── frontend/
│   ├── src/
│   └── public/
├── README.md
```

---

## ✅ Features

- Upload and view PDF documents
- Chat with PDFs using TinyLLaMA
- Clean UI without download/print distractions
- Works entirely locally

---

## ⚠️ Notes

- Ollama **must be running** for the chatbot to work.
- LLM is currently supported **only for local inference**.

---

## 🐙 Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit with frontend, backend, and README"
git branch -M main
git remote add origin https://github.com/your-username/notebooklm-clone.git
git push -u origin main
```
