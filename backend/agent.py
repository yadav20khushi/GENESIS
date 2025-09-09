from letta_client import Letta, MessageCreate, TextContent
from backend.config import settings
import json

client = Letta(
    project=settings.LETTA_PROJECT,
    token=settings.LETTA_API_KEY
)

def send_message_to_letta(user_message: str) -> dict:
    response = client.agents.messages.create(
        agent_id=settings.AGENT_ID,
        messages=[MessageCreate(
            role="user",
            content=[TextContent(text=user_message)],
        )],
        max_steps=1,
        include_return_message_types=["assistant_message"]
    )

    data = {
        "reply": "No response from agent.",
        "scenes": [],
        "cuts": [],
        "keyframes": []
    }

    if hasattr(response, "messages") and response.messages:
        assistant_message = response.messages[0]
        if hasattr(assistant_message, "content"):
            if isinstance(assistant_message.content, str):
                raw_reply = assistant_message.content
            elif isinstance(assistant_message.content, list):
                raw_reply = " ".join([c.text for c in assistant_message.content if hasattr(c, "text")])
            else:
                raw_reply = ""

            try:
                parsed = json.loads(raw_reply)
                data.update(parsed)
            except json.JSONDecodeError:
                data["reply"] = raw_reply
                data["scenes"] = []
                data["cuts"] = []
                data["keyframes"] = []

    return data
