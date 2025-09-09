from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes import chat
from backend.config import settings

# Initialize FastAPI app
app = FastAPI(
    title="Genesis Backend",
    description="FastAPI backend for React + Letta agent integration",
    version="1.0.0",
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],  # Allow React frontend
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Mount chat routes
app.include_router(chat.router, prefix="/api", tags=["Chat"])

# Health check endpoint
@app.get("/api/health")
async def health_check():
    return {"status": "ok"}
