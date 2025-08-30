"""
Agents reply-
messages=[AssistantMessage(id='message-07e2a77b-7f15-440f-a4b9-6d7e063f8779', date=datetime.datetime(2025, 8, 27, 7, 46, 53, tzinfo=TzInfo(UTC)), name=None, message_type='assistant_message', otid='07e2a77b-7f15-440f-a4b9-6d7e063f8701', sender_id=None, step_id='step-c66f4f18-4b75-4e5a-9a81-e59b1ab1af98', is_err=None, content="No proble
m at all! I'm here whenever you're ready. Let me know what you need!", seq_id=None, run_id=None)] stop_reason=LettaStopReason(message_type='stop_reason', stop_reason='m
ax_steps') usage=LettaUsageStatistics(message_type='usage_statistics', completion_tokens=49, prompt_tokens=7905, total_tokens=7954, step_count=1, steps_messages=None, run_ids=None)

"""
from letta_client import Letta, MessageCreate, TextContent
import os
from dotenv import load_dotenv

load_dotenv()

client = Letta(
    project = os.getenv('LETTA_PROJECT'),
    token=os.getenv("LETTA_API_KEY")
)


res= client.agents.messages.create(
    agent_id=os.getenv("AGENT_ID"),
    messages=[
        MessageCreate(
            role="user",
            content=[
                TextContent(
                    text="Give me the scenes list for the synopsis Scout Finch grows up in the racially tense 1930s Alabama. Her father, Atticus, defends Tom Robinson, a black man accused of raping a white woman. The trial exposes Scout and her brother, Jem, to the harsh realities of racism, teaching them empathy and justice.",
                )
            ],
        )
    ],
    max_steps=1,
    include_return_message_types=['assistant_message']
)

#Streaming -- returns a generator obj

print(res)

