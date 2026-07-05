from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.database.session import engine, Base
from app.api.v1 import auth, portfolio, blog, contact, admin, ai

from fastapi.staticfiles import StaticFiles
import os

# Create tables if they do not exist
Base.metadata.create_all(bind=engine)

app = FastAPI(

    title=settings.PROJECT_NAME,
    description="FastAPI Backend for Archi Parmar's AI Personal Portfolio Website",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
)

# Set CORS origins
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://localhost:3000",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "*" # Allow all for local development & deployment ease (adjust in production if needed)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static uploads
if not os.path.exists("uploads"):
    os.makedirs("uploads")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Include API Routers
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["Authentication"])
app.include_router(portfolio.router, prefix=f"{settings.API_V1_STR}/portfolio", tags=["Portfolio"])
app.include_router(blog.router, prefix=f"{settings.API_V1_STR}/blog", tags=["Blog"])
app.include_router(contact.router, prefix=f"{settings.API_V1_STR}/contact", tags=["Contact"])
app.include_router(admin.router, prefix=f"{settings.API_V1_STR}/admin", tags=["Admin"])
app.include_router(ai.router, prefix=f"{settings.API_V1_STR}/ai", tags=["AI Agent"])

@app.on_event("startup")
def startup_event():
    from app.ai.vector_store import vector_store
    from app.database.session import SessionLocal
    if not vector_store.documents:
        print("Vector index is empty. Rebuilding...")
        db = SessionLocal()
        try:
            vector_store.rebuild_index(db)
        except Exception as e:
            print(f"Failed to rebuild index on startup: {e}")
        finally:
            db.close()

@app.get("/")
def read_root():
    return {
        "status": "ONLINE",
        "system": "AI_ENGINEER.OS_BACKEND",
        "version": "1.0.0",
        "api_docs": f"{settings.API_V1_STR}/docs"
    }
