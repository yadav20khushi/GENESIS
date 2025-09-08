from pydantic import BaseModel
from typing import List, Optional

class Scene(BaseModel):
    id: int
    title: str
    description: str

class Cut(BaseModel):
    id: int
    scene_id: Optional[int] = None
    description: str

class Keyframe(BaseModel):
    id: Optional[int] = None
    cut_id: int
    image_url: Optional[str] = None

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    reply: str
    scenes: List[Scene] = []
    cuts: List[Cut] = []
    keyframes: List[Keyframe] = []
