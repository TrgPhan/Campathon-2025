from dotenv import load_dotenv
from langchain_core.messages import HumanMessage, AIMessage
from langgraph.prebuilt import create_react_agent
from .tools.retrieve_recipe_tool import recipe_retrieve_tool
from .config import get_llm_for_agent
from .prompt.agent_prompt import prompt

def create_conversational_agent():
    """Tạo agent với khả năng hội thoại"""
    tools = [recipe_retrieve_tool]
    agent_executor = create_react_agent(
        model=get_llm_for_agent(),
        tools=tools,
        prompt=prompt,
        debug=False,
    )
    return agent_executor


def process_message(user_messages, history_conversation=None, limit_message=None):
    """
    Xử lý hội thoại cho api
    user_messages: request người dùng
    history_conversation: lịch sử cuộc hội thoại
    limit_message: giới hạn tin nhắn trong 1 cuộc hội thoại
    """
    if history_conversation == None:
        history_conversation = []

    if limit_message and len(history_conversation) > limit_message:
        history_conversation = history_conversation[-limit_message:]
    history_conversation.append(HumanMessage(content=user_messages))

    agent_executor = create_conversational_agent()
    state = agent_executor.invoke({"messages" : history_conversation})

    assistant_response = state['messages'][-1].content

    history_conversation.append(AIMessage(content=assistant_response))

    if limit_message and len(history_conversation) > limit_message:
        history_conversation = history_conversation[-limit_message:]
    
    return assistant_response, history_conversation