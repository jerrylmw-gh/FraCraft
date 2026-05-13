from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import json
import logging
import uuid
import random
import re
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, timezone

from emergentintegrations.llm.chat import LlmChat, UserMessage


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')

app = FastAPI()
api_router = APIRouter(prefix="/api")


# ---------- Models ----------
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


class FractionProblem(BaseModel):
    id: str
    topic: str  # add | subtract | multiply | divide | compare | word
    difficulty: str  # easy | medium | hard
    question: str
    choices: List[str]
    correct_index: int
    explanation: str
    minecraft_flavor: str  # e.g., "diamond ore", "wheat"


class GenerateRequest(BaseModel):
    topic: Optional[str] = "word"  # word, add, subtract, compare
    difficulty: Optional[str] = "easy"


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "Minecraft Fractions API", "status": "ok"}


@api_router.post("/problems/generate", response_model=FractionProblem)
async def generate_problem(req: GenerateRequest):
    if not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=500, detail="EMERGENT_LLM_KEY not configured")

    topic = req.topic or "word"
    difficulty = req.difficulty or "easy"

    flavors = [
        "diamond ore", "emerald ore", "wheat", "carrots", "iron ingots",
        "golden apples", "cobblestone blocks", "redstone dust", "TNT",
        "ender pearls", "cookies", "cake slices",
    ]
    flavor = random.choice(flavors)

    system_message = (
        "You are a friendly math tutor for 4th-grade students who love Minecraft. "
        "Generate ONE fraction math problem with a Minecraft theme. "
        "Respond ONLY with valid JSON, no markdown, no code fences."
    )

    user_prompt = f"""Create one 4th-grade fraction word problem.

Theme item: {flavor}
Topic: {topic}  (one of: word, add, subtract, multiply, compare)
Difficulty: {difficulty}  (easy=denominators 2-6, medium=denominators up to 10, hard=mixed numbers / unlike denominators up to 12)

Rules:
- Use simple, kid-friendly Minecraft language (Steve, Alex, Creepers, pickaxe, chest, mining, crafting, farm).
- Keep numbers small. Final answer must be a clean fraction or whole number.
- Provide exactly 4 multiple-choice options as plain strings (e.g. "1/2", "3/4", "2", "5/8").
- Make wrong options plausible (common mistakes).
- correct_index is 0-based.
- Explanation: 1-2 short sentences a 10-year-old can understand.

Return JSON in EXACTLY this shape:
{{
  "question": "string",
  "choices": ["a","b","c","d"],
  "correct_index": 0,
  "explanation": "string"
}}"""

    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"frac-{uuid.uuid4()}",
            system_message=system_message,
        ).with_model("anthropic", "claude-sonnet-4-5-20250929")

        response = await chat.send_message(UserMessage(text=user_prompt))

        # Extract JSON
        text = response.strip()
        # Remove markdown fences if any
        text = re.sub(r"^```(?:json)?", "", text).strip()
        text = re.sub(r"```$", "", text).strip()
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if not match:
            raise ValueError(f"No JSON in LLM response: {response[:200]}")
        data = json.loads(match.group(0))

        problem = FractionProblem(
            id=str(uuid.uuid4()),
            topic=topic,
            difficulty=difficulty,
            question=data["question"],
            choices=data["choices"],
            correct_index=int(data["correct_index"]),
            explanation=data["explanation"],
            minecraft_flavor=flavor,
        )
        return problem
    except Exception as e:
        logger.exception("LLM generation failed")
        raise HTTPException(status_code=500, detail=f"LLM error: {str(e)}")


@api_router.get("/health")
async def health():
    return {"ok": True}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
