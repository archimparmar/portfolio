from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from app.database.session import get_db
from app.ai.vector_store import vector_store
from app.ai.llm_provider import llm_provider
from app.auth.deps import get_current_user
from pypdf import PdfReader
import io
import re

router = APIRouter()

# Schema for Chat Requests
class ChatHistoryItem(BaseModel):
    role: str # 'user' or 'assistant'
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatHistoryItem]] = None

# Admin authorization dependency
admin_dependency = Depends(get_current_user)

@router.post("/chat")
def chat_assistant(request: ChatRequest, db: Session = Depends(get_db)):
    """Dynamic stream completion using retrieved database vector contexts."""
    query = request.message
    
    # 1. Query local vector database with context-aware routing filters
    query_lower = query.lower()

    # --- Greeting detection: send no DB context, let system prompt handle it ---
    greetings = ["hi", "hello", "hey", "good morning", "good afternoon", "good evening", "greetings"]
    is_greeting = any(query_lower.strip() == g or query_lower.strip().startswith(g + " ") for g in greetings)

    if is_greeting:
        matched_docs = []  # System prompt greeting rule handles this cleanly

    # --- Email / contact routing ---
    elif any(k in query_lower for k in ["email", "mail id", "email address", "mail"]):
        matched_docs = [doc for doc in vector_store.documents if doc["metadata"].get("type") == "about"][:1]

    # --- Phone / mobile routing ---
    elif any(k in query_lower for k in ["phone", "mobile", "contact number", "number"]):
        matched_docs = [doc for doc in vector_store.documents if doc["metadata"].get("type") == "about"][:1]

    # --- LinkedIn routing ---
    elif "linkedin" in query_lower:
        matched_docs = [doc for doc in vector_store.documents if doc["metadata"].get("type") in ["about", "social"]][:1]

    # --- GitHub routing ---
    elif "github" in query_lower:
        matched_docs = [doc for doc in vector_store.documents if doc["metadata"].get("type") in ["about", "social"]][:1]

    # --- Research / paper routing ---
    elif any(r in query_lower for r in ["research", "paper", "survey", "publication", "irjmets", "published"]):
        matched_docs = [doc for doc in vector_store.documents if doc["metadata"].get("type") == "research"]
        if not matched_docs:
            matched_docs = vector_store.search(query, limit=2)

    # --- Project routing (specific or general) ---
    elif "project" in query_lower or any(p in query_lower for p in ["bhojanvilla", "docmind", "summarizer", "speech", "nexnote", "vision", "stellarsence"]):
        project_docs = [doc for doc in vector_store.documents if doc["metadata"].get("type") == "project"]
        specific_docs = []
        for p in ["bhojanvilla", "docmind", "summarizer", "speech", "nexnote", "vision", "stellarsence"]:
            if p in query_lower:
                specific_docs.extend([doc for doc in project_docs if p in doc["content"].lower()])
        if specific_docs:
            matched_docs = specific_docs[:2]
        else:
            matched_docs = vector_store.search(query, limit=2)

    # --- Skills / technologies routing ---
    elif any(s in query_lower for s in ["skill", "skills", "technology", "technologies", "tech stack", "programming", "language", "framework", "python", "django", "fastapi", "react", "javascript"]):
        skill_docs = [doc for doc in vector_store.documents if doc["metadata"].get("type") == "skill"]
        specific_docs = [doc for doc in skill_docs if doc["metadata"].get("name", "").lower() in query_lower]
        matched_docs = specific_docs[:4] if specific_docs else vector_store.search(query, limit=3)

    # --- Education / degree routing ---
    elif any(e in query_lower for e in ["education", "degree", "university", "college", "study", "studied", "cgpa", "gpa", "b.tech", "btech", "engineering"]):
        matched_docs = [doc for doc in vector_store.documents if doc["metadata"].get("type") == "education"]
        if not matched_docs:
            matched_docs = vector_store.search(query, limit=2)

    # --- Experience / internship / work routing ---
    elif any(e in query_lower for e in ["experience", "internship", "intern", "work", "job", "company", "role", "position"]):
        matched_docs = [doc for doc in vector_store.documents if doc["metadata"].get("type") == "experience"]
        if not matched_docs:
            matched_docs = vector_store.search(query, limit=2)

    # --- Certifications routing ---
    elif any(c in query_lower for c in ["certification", "certifications", "certificate", "certified", "course"]):
        matched_docs = [doc for doc in vector_store.documents if doc["metadata"].get("type") == "certification"]
        if not matched_docs:
            matched_docs = vector_store.search(query, limit=2)

    # --- Achievements / awards routing ---
    elif any(a in query_lower for a in ["achievement", "achievements", "award", "awards", "gate", "rank", "honor", "won", "qualified"]):
        matched_docs = [doc for doc in vector_store.documents if doc["metadata"].get("type") == "achievement"]
        if not matched_docs:
            matched_docs = vector_store.search(query, limit=2)

    # --- Events / hackathon / competition routing ---
    elif any(ev in query_lower for ev in ["event", "events", "hackathon", "competition", "workshop", "seminar", "technical event"]):
        matched_docs = [doc for doc in vector_store.documents if doc["metadata"].get("type") == "event"]
        if not matched_docs:
            matched_docs = vector_store.search(query, limit=2)

    # --- About / general / hire me routing ---
    elif any(a in query_lower for a in ["about", "who", "tell me", "introduce", "biography", "bio", "hire", "why hire"]):
        matched_docs = [doc for doc in vector_store.documents if doc["metadata"].get("type") == "about"][:1]

    # --- Default semantic search fallback ---
    else:
        matched_docs = vector_store.search(query, limit=3)

    context_chunks = [doc["content"] for doc in matched_docs]
    
    # 2. Convert history schema to dictionaries
    history_list = []
    if request.history:
        history_list = [{"role": h.role, "content": h.content} for h in request.history]

    # 3. Stream event completions using Server-Sent Events (SSE)
    def event_generator():
        # Yield the list of matching record headers as a RAG disclosure metadata
        references = [doc["metadata"] for doc in matched_docs]
        yield f"data: {json_metadata(references)}\n\n"
        
        try:
            for chunk in llm_provider.stream_completion(query, context_chunks, history_list):
                # Standard Server-Sent Events structure
                # Yield text chunk directly
                yield f"data: {chunk}\n\n"
        except Exception as e:
            yield f"data: Error generating response stream: {str(e)}\n\n"
            
        yield "data: [DONE]\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")

@router.get("/search")
def search_vector_store(q: str):
    """Debug route to verify semantic search hits."""
    if not q:
        raise HTTPException(status_code=400, detail="Query parameter 'q' is required")
    hits = vector_store.search(q, limit=6)
    return {"query": q, "results": hits}

@router.post("/context/rebuild")
def rebuild_ai_index(db: Session = Depends(get_db), _=admin_dependency):
    """Admin route to pull PostgreSQL/SQLite records and rebuild search vectors."""
    try:
        vector_store.rebuild_index(db)
        return {"status": "SUCCESS", "message": f"AI Vector Database rebuilt successfully with {len(vector_store.documents)} records."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Rebuild failed: {str(e)}")

@router.post("/upload")
def upload_knowledge_file(file: UploadFile = File(...), db: Session = Depends(get_db), _=admin_dependency):
    """Admin route to parse uploaded PDF/Text resume attachments and index the text."""
    if not file.filename.lower().endswith((".pdf", ".txt")):
        raise HTTPException(status_code=400, detail="Only PDF and TXT files are accepted.")

    extracted_text = ""
    try:
        contents = file.file.read()
        if file.filename.lower().endswith(".pdf"):
            pdf_file = io.BytesIO(contents)
            reader = PdfReader(pdf_file)
            for page in reader.pages:
                extracted_text += page.extract_text() or ""
        else:
            extracted_text = contents.decode("utf-8", errors="ignore")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read file contents: {str(e)}")

    if not extracted_text.strip():
        raise HTTPException(status_code=400, detail="No readable text extracted from file.")

    # Chunk the text into passages of ~600 chars with 100 overlap
    chunks = chunk_text(extracted_text, chunk_size=600, overlap=100)
    
    for idx, chunk in enumerate(chunks):
        vector_store.add_document(
            content=f"Resume Attachment Source Document. Passage: {chunk}",
            metadata={"type": "uploaded_file", "filename": file.filename, "chunk_index": idx}
        )
        
    vector_store.build_vocabulary()
    vector_store.save()
    return {
        "status": "SUCCESS", 
        "filename": file.filename, 
        "chunks_indexed": len(chunks),
        "total_documents": len(vector_store.documents)
    }

def chunk_text(text: str, chunk_size: int, overlap: int) -> List[str]:
    """Helper to split document text into overlapping passages."""
    text = re.sub(r"\s+", " ", text).strip()
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start += (chunk_size - overlap)
    return chunks

def json_metadata(references: List[Dict[str, Any]]) -> str:
    """Helper to encode metadata payload."""
    import json
    return json.dumps({"references": references})
