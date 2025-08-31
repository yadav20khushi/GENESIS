from letta_client import Letta, MessageCreate, TextContent
from config import settings

client = Letta(
    project=settings.LETTA_PROJECT,
    token=settings.LETTA_API_KEY
)

def send_message_to_letta(user_message: str) -> dict:
    """
    Sends a message to Letta agent and returns structured JSON.
    """
    response = client.agents.messages.create(
        agent_id=settings.AGENT_ID,
        messages=[MessageCreate(
            role="user",
            content=[TextContent(text=user_message)],
        )],
        max_steps=2,
        include_return_message_types=["assistant_message"]
    )

    # Default response format
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
                data["reply"] = assistant_message.content
            elif isinstance(assistant_message.content, list):
                data["reply"] = " ".join([c.text for c in assistant_message.content if hasattr(c, "text")])

    try:
        import json
        parsed = json.loads(data["reply"])
        data.update(parsed)
    except:
        pass  # fallback: plain text reply

    return data
