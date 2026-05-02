# AI PDF Chatbot (RAG-Based)

An AI-powered PDF Question Answering system built using the MERN-style frontend/backend approach with Python backend technologies.

This application allows users to:

- Upload PDF documents
- Convert document content into vector embeddings
- Store embeddings in a vector database
- Ask natural language questions about the uploaded document
- Receive context-aware answers powered by AI

---

## Features

✅ Upload PDF documents  
✅ Extract text from PDFs  
✅ Intelligent text chunking  
✅ Vector embeddings generation  
✅ Semantic search using vector similarity  
✅ Retrieval-Augmented Generation (RAG)  
✅ Real-time chat interface  
✅ Modern React frontend  

---

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios

### Backend
- FastAPI
- Python

### AI / RAG Pipeline
- LangChain
- HuggingFace Embeddings
- ChromaDB
- Mistral AI

---

## Project Architecture

```text
User Uploads PDF
       ↓
FastAPI Backend
       ↓
PDF Loader
       ↓
Text Splitter
       ↓
Embedding Model
       ↓
Chroma Vector Database
       ↓
Retriever
       ↓
Mistral LLM
       ↓
AI Response