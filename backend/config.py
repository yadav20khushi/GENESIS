import os
from dotenv import load_dotenv
import pdb

load_dotenv()

class Settings:
    #pdb.set_trace()
    LETTA_API_KEY: str = os.getenv("LETTA_API_KEY")
    LETTA_PROJECT: str = os.getenv("LETTA_PROJECT")
    AGENT_ID: str = os.getenv("AGENT_ID")

    APP_NAME: str = "Genesis Backend"
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"

    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")

settings = Settings()
