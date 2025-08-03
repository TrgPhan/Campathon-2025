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

def chat_with_agent():
    """Hàm chính để chat với agent có lịch sử"""
    print("🍳 Recipe Assistant - Type 'quit', 'exit', or 'bye' to end the conversation")
    print("=" * 60)
    
    # Khởi tạo agent
    agent_executor = create_conversational_agent()
    
    # Lưu lịch sử hội thoại
    conversation_history = []
    
    while True:
        try:
            # Nhận input từ user
            user_input = input("\n👤 You: ").strip()
            
            # Kiểm tra lệnh thoát
            if user_input.lower() in ['quit', 'exit', 'bye', 'q']:
                print("\n👋 Goodbye! Happy cooking!")
                break
            
            if not user_input:
                print("Please enter a message or type 'quit' to exit.")
                continue
            
            # Thêm message của user vào lịch sử
            conversation_history.append(HumanMessage(content=user_input))
            
            # Tạo input cho agent với toàn bộ lịch sử
            inputs = {"messages": conversation_history}
            
            # Gọi agent
            print("\n🤖 Assistant: ", end="")
            state = agent_executor.invoke(inputs)
            
            # Lấy response từ agent
            assistant_response = state["messages"][-1].content
            print(assistant_response)
            
            # Thêm response của assistant vào lịch sử
            conversation_history.append(AIMessage(content=assistant_response))
            
        except KeyboardInterrupt:
            print("\n\n👋 Goodbye! Happy cooking!")
            break
        except Exception as e:
            print(f"\n❌ Error: {str(e)}")
            print("Please try again.")

def chat_with_session_management():
    """Phiên bản nâng cao với quản lý session"""
    print("🍳 Recipe Assistant - Advanced Session Management")
    print("Commands: 'quit'/'exit'/'bye' to end, 'clear' to clear history, 'history' to view conversation")
    print("=" * 80)
    
    agent_executor = create_conversational_agent()
    conversation_history = []
    
    while True:
        try:
            user_input = input("\n👤 You: ").strip()
            
            # Xử lý các lệnh đặc biệt
            if user_input.lower() in ['quit', 'exit', 'bye', 'q']:
                print("\n👋 Goodbye! Happy cooking!")
                break
            elif user_input.lower() == 'clear':
                conversation_history = []
                print("✅ Conversation history cleared!")
                continue
            elif user_input.lower() == 'history':
                print("\n📜 Conversation History:")
                if not conversation_history:
                    print("No conversation history yet.")
                else:
                    for i, msg in enumerate(conversation_history):
                        role = "👤 You" if isinstance(msg, HumanMessage) else "🤖 Assistant"
                        print(f"{i+1}. {role}: {msg.content[:100]}{'...' if len(msg.content) > 100 else ''}")
                continue
            
            if not user_input:
                print("Please enter a message or use a command.")
                continue
            
            # Thêm message vào lịch sử
            conversation_history.append(HumanMessage(content=user_input))
            
            # Gọi agent với lịch sử đầy đủ
            inputs = {"messages": conversation_history}
            
            print("\n🤖 Assistant: ", end="")
            state = agent_executor.invoke(inputs)
            
            assistant_response = state["messages"][-1].content
            print(assistant_response)
            
            # Cập nhật lịch sử với response mới nhất
            conversation_history.append(AIMessage(content=assistant_response))
            
        except KeyboardInterrupt:
            print("\n\n👋 Goodbye! Happy cooking!")
            break
        except Exception as e:
            print(f"\n❌ Error: {str(e)}")

def chat_with_memory_limit():
    """Phiên bản với giới hạn memory để tránh context quá dài"""
    print("🍳 Recipe Assistant - Memory Limited")
    print("Type 'quit', 'exit', or 'bye' to end the conversation")
    print("=" * 60)
    
    agent_executor = create_conversational_agent()
    conversation_history = []
    MAX_HISTORY = 10  # Giữ tối đa 10 messages gần nhất
    
    while True:
        try:
            user_input = input("\n👤 You: ").strip()
            
            if user_input.lower() in ['quit', 'exit', 'bye', 'q']:
                print("\n👋 Goodbye! Happy cooking!")
                break
            
            if not user_input:
                continue
            
            # Thêm message của user
            conversation_history.append(HumanMessage(content=user_input))
            
            # Giới hạn lịch sử để tránh context quá dài
            if len(conversation_history) > MAX_HISTORY:
                conversation_history = conversation_history[-MAX_HISTORY:]
            
            inputs = {"messages": conversation_history}
            
            print("\n🤖 Assistant: ", end="")
            state = agent_executor.invoke(inputs)
            
            assistant_response = state["messages"][-1].content
            print(assistant_response)
            
            # Thêm response của assistant
            conversation_history.append(AIMessage(content=assistant_response))
            
            # Giới hạn lại nếu cần
            if len(conversation_history) > MAX_HISTORY:
                conversation_history = conversation_history[-MAX_HISTORY:]
                
        except KeyboardInterrupt:
            print("\n\n👋 Goodbye! Happy cooking!")
            break
        except Exception as e:
            print(f"\n❌ Error: {str(e)}")

# Chạy chương trình
if __name__ == "__main__":
    # Chọn phiên bản bạn muốn sử dụng:
    
    # Phiên bản cơ bản
    # chat_with_agent()
    
    # Phiên bản nâng cao với quản lý session
    # chat_with_session_management()
    
    # Phiên bản với giới hạn memory
    chat_with_memory_limit()