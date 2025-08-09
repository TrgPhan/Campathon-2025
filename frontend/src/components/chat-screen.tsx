"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Send, Bot, User, Square, Plus, Trash2, MessageCircle, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import FoodCard from "@/components/food-card"
import { chatSessionManager } from "@/lib/cache"
import type { Message, ChatSession } from "@/lib/types"
import { TASK_PROMPTS, FOOD_SUGGESTIONS, TYPING_SPEED, TYPING_DELAY } from "@/lib/constants"

// Utility function to parse markdown-like formatting
const parseMarkdown = (text: string) => {
  // Bold: **text** -> <strong>text</strong>
  text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

  // Italic: *text* -> <em>text</em>
  text = text.replace(/\*(.*?)\*/g, "<em>$1</em>")

  // Underline: __text__ -> <u>text</u>
  text = text.replace(/__(.*?)__/g, "<u>$1</u>")

  return text
}

const taskPrompts = TASK_PROMPTS

export default function ChatScreen() {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState("")
  const [currentTypingMessageId, setCurrentTypingMessageId] = useState<string | null>(null)
  const [typingText, setTypingText] = useState("")
  const [typingInterval, setTypingInterval] = useState<NodeJS.Timeout | null>(null)
  const [showChatHistory, setShowChatHistory] = useState(false)
  const [isNewChatButtonPressed, setIsNewChatButtonPressed] = useState(false)

  // Load chat sessions on mount
  useEffect(() => {
    const sessions = chatSessionManager.getAllSessions()
    setChatSessions(sessions)

    const currentId = chatSessionManager.getCurrentSessionId()
    if (currentId && sessions.find((s: ChatSession) => s.id === currentId)) {
      setCurrentSessionId(currentId)
      const currentSession = chatSessionManager.getSession(currentId)
      if (currentSession) {
        setMessages(currentSession.messages)
      }
    } else if (sessions.length > 0) {
      // Load first session if no current session
      setCurrentSessionId(sessions[0].id)
      setMessages(sessions[0].messages)
      chatSessionManager.setCurrentSession(sessions[0].id)
    }
  }, [])

  // Save messages when they change
  useEffect(() => {
    if (currentSessionId && messages.length > 0) {
      chatSessionManager.updateSession(currentSessionId, messages)
      // Refresh sessions to update titles
      setChatSessions(chatSessionManager.getAllSessions())
    }
  }, [messages, currentSessionId])

  const foodSuggestions = FOOD_SUGGESTIONS

  const typeMessage = (messageId: string, text: string, callback?: () => void) => {
    // Clear any existing typing interval
    if (typingInterval) {
      clearInterval(typingInterval)
    }

    setCurrentTypingMessageId(messageId)
    setTypingText("")
    let currentIndex = 0

    const interval = setInterval(() => {
      if (currentIndex >= text.length) {
        clearInterval(interval)
        setCurrentTypingMessageId(null)
        setTypingText("")
        setTypingInterval(null)

        // Update message to not typing
        setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, isTyping: false } : msg)))

        if (callback) callback()
        return
      }

      setTypingText(text.slice(0, currentIndex + 1))
      currentIndex++
    }, TYPING_SPEED)

    setTypingInterval(interval)
  }

  const stopTyping = () => {
    if (typingInterval) {
      clearInterval(typingInterval)
      setTypingInterval(null)
    }

    if (currentTypingMessageId) {
      // Complete the current message
      setMessages((prev) => prev.map((msg) => (msg.id === currentTypingMessageId ? { ...msg, isTyping: false } : msg)))
      setCurrentTypingMessageId(null)
      setTypingText("")
    }
  }

  const addBotMessage = (
    text: string,
    foodSuggestions?: Array<{ id: string; name: string; image: string; ingredients: string[] }>,
    delay = TYPING_DELAY,
  ) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const messageId = `bot-${Date.now()}-${Math.random()}`
        const botResponse: Message = {
          id: messageId,
          text,
          isBot: true,
          timestamp: new Date(),
          isTyping: true,
          foodSuggestions,
        }

        setMessages((prev) => [...prev, botResponse])

        typeMessage(messageId, text, () => {
          resolve()
        })
      }, delay)
    })
  }

  const handleSendMessage = () => {
    if (!inputText.trim()) return

    const newMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputText,
      isBot: false,
      timestamp: new Date(),
      isTyping: false,
    }

    setMessages((prev) => [...prev, newMessage])
    setInputText("")

    // Simulate bot response with typing effect
    addBotMessage("Cảm ơn bạn đã nhắn tin! Tôi đang xử lý yêu cầu của bạn và sẽ trả lời sớm nhất có thể.")
  }

  const handleTaskClick = async (task: (typeof taskPrompts)[0]) => {
    const taskMessage: Message = {
      id: `user-${Date.now()}-${Math.random()}`,
      text: task.description,
      isBot: false,
      timestamp: new Date(),
      isTyping: false,
    }
    setMessages((prev) => [...prev, taskMessage])

    // Handle specific task responses
    if (task.id === "1") {
      // Gợi ý món ăn - show messages sequentially
      try {
        // First message
        await addBotMessage(
          "Bạn muốn **tăng cân**, **giảm cân** hay **giữ cân**? Tôi sẽ gợi ý các món ăn phù hợp cho bạn.",
          undefined,
          TYPING_DELAY,
        )

        // Second message with gain foods
        await addBotMessage(
          "🏋️ **Tăng cân**: Các món ăn giàu protein và calo để tăng cân lành mạnh:",
          foodSuggestions.gain,
          TYPING_DELAY,
        )

        // Third message with lose foods
        await addBotMessage(
          "🏃 **Giảm cân**: Các món ăn ít calo nhưng giàu dinh dưỡng để giảm cân hiệu quả:",
          foodSuggestions.lose,
          TYPING_DELAY,
        )

        // Fourth message with maintain foods
        await addBotMessage(
          "⚖️ **Giữ cân**: Các món ăn cân bằng để duy trì cân nặng ổn định:",
          foodSuggestions.maintain,
          TYPING_DELAY,
        )
      } catch (error) {
        console.error("Error in sequential messaging:", error)
      }
    } else if (task.id === "2") {
      // Hỏi cách nấu ăn
      addBotMessage(
        "Tôi có thể hướng dẫn bạn cách nấu nhiều món ăn khác nhau. Bạn muốn học nấu món gì? Hãy cho tôi biết tên món ăn và tôi sẽ hướng dẫn chi tiết từng bước.",
      )
    } else if (task.id === "3") {
      // Tư vấn sức khỏe
      addBotMessage(
        "Tôi có thể tư vấn về **dinh dưỡng** và **sức khỏe** cho bạn. Bạn có thể hỏi về:\n\n• **Chế độ ăn uống lành mạnh**\n• **Cách tính toán calo hàng ngày**\n• **Lời khuyên về vitamin và khoáng chất**\n• **Thực đơn cho các mục tiêu sức khỏe cụ thể**\n\nBạn muốn tư vấn về vấn đề gì?",
      )
    }
  }

  const handleNewChat = () => {
    setIsNewChatButtonPressed(true)
    setTimeout(() => {
      const newSession = chatSessionManager.createNewSession()
      setChatSessions(chatSessionManager.getAllSessions())
      setCurrentSessionId(newSession.id)
      setMessages(newSession.messages)
      setIsNewChatButtonPressed(false)
    }, 150)
  }

  const handleSelectSession = (sessionId: string) => {
    setCurrentSessionId(sessionId)
    chatSessionManager.setCurrentSession(sessionId)
    const session = chatSessionManager.getSession(sessionId)
    if (session) {
      setMessages(session.messages)
    }
  }

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    chatSessionManager.deleteSession(sessionId)
    const updatedSessions = chatSessionManager.getAllSessions()
    setChatSessions(updatedSessions)

    if (currentSessionId === sessionId) {
      if (updatedSessions.length > 0) {
        handleSelectSession(updatedSessions[0].id)
      } else {
        handleNewChat()
      }
    }
  }

  return (
    <div className="h-full bg-white flex">
      {/* Overlay for clicking outside to close sidebar */}
      {showChatHistory && (
        <div 
          className="fixed inset-0 bg-opacity-25 z-15 cursor-pointer"
          onClick={() => setShowChatHistory(false)}
          style={{ pointerEvents: 'auto' }}
        />
      )}
      
      {/* Chat Area */}
      <div className="flex-1 flex flex-col overflow-y-auto">
                 <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200/50 flex-shrink-0">
           <div className="flex items-center justify-between">
             <div>
               <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-indigo-800 tracking-tight">
                 AI Chat Assistant
               </h1>
               <p className="text-blue-600/80 mt-1 text-xs font-medium">Trò chuyện với AI để được hỗ trợ về ẩm thực và sức khỏe</p>
             </div>
             <Button
               variant="ghost"
               size="sm"
               onClick={() => setShowChatHistory(!showChatHistory)}
               className="p-2 hover:bg-blue-100/50 transition-colors duration-200"
             >
               <Menu size={20} className="text-blue-700" />
             </Button>
           </div>
         </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Task Prompts - Now inline in chat */}
          {messages.length <= 1 && (
                         <div className="px-6 py-6 border-b border-gray-100/50 bg-gradient-to-b from-gray-50/30 to-transparent">
               <h3 className="text-lg font-semibold text-gray-900 mb-4 tracking-tight">Gợi ý câu hỏi</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {taskPrompts.map((task) => (
                                     <Card
                     key={task.id}
                     className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${task.color} border-0 shadow-sm`}
                     onClick={() => handleTaskClick(task)}
                   >
                     <div className="flex items-start gap-3">
                       <span className="text-2xl">{task.icon}</span>
                       <div className="flex-1">
                         <h3 className="font-semibold text-sm mb-1 text-gray-900">{task.title}</h3>
                         <p className="text-xs text-gray-600 leading-relaxed">{task.description}</p>
                       </div>
                     </div>
                   </Card>
                ))}
              </div>
            </div>
          )}

          <ScrollArea className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-4">
              {messages.map((message) => (
                <div key={message.id}>
                  <div className={`flex gap-3 ${message.isBot ? "justify-start" : "justify-end"}`}>
                    {message.isBot && (
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot size={16} className="text-blue-600" />
                      </div>
                    )}
                    <div
                      className={`max-w-[70%] p-4 rounded-lg ${message.isBot ? "bg-gray-100 text-gray-800" : "bg-blue-500 text-white"
                        }`}
                    >
                      <div
                        className="text-sm leading-relaxed whitespace-pre-line"
                        dangerouslySetInnerHTML={{
                          __html:
                            message.isTyping && currentTypingMessageId === message.id
                              ? parseMarkdown(typingText + "|")
                              : parseMarkdown(message.text),
                        }}
                      />
                      <p className={`text-xs mt-2 ${message.isBot ? "text-gray-500" : "text-blue-100"}`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                      {message.isTyping && currentTypingMessageId === message.id && (
                        <div className="mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={stopTyping}
                            className="h-6 px-2 text-xs bg-transparent"
                          >
                            <Square size={12} className="mr-1" />
                            Dừng
                          </Button>
                        </div>
                      )}
                    </div>
                    {!message.isBot && (
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <User size={16} className="text-green-600" />
                      </div>
                    )}
                  </div>

                  {/* Food Suggestions - Show below each message that has them */}
                  {message.foodSuggestions && !message.isTyping && (
                    <div className="mt-4 ml-11">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {message.foodSuggestions.map((food) => (
                          <FoodCard 
                            key={food.id} 
                            id={food.id}
                            name={food.name}
                            image={food.image}
                            cookingTime="30 phút"
                            difficulty="Dễ"
                            isAvailable={true}
                            calories={food.calories ?? 0}
                            protein={food.protein ?? 0}
                            carbs={food.carbs ?? 0}
                            fat={food.fat ?? 0}
                            onAdd={(id) => {
                              console.log("Adding food to calendar:", id)
                              // TODO: Implement add to calendar functionality
                            }}
                            onEdit={(id) => {
                              console.log("Editing food:", id)
                              // TODO: Implement edit functionality
                            }}
                            onDelete={(id) => {
                              console.log("Deleting food:", id)
                              // TODO: Implement delete functionality
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

                 <div className="p-4 border-t flex-shrink-0">
           <div className="flex gap-3">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Nhập tin nhắn của bạn..."
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1 py-2"
            />
            <Button onClick={handleSendMessage} className="px-4 py-2">
              <Send size={14} className="mr-2" />
              Gửi
            </Button>
          </div>
        </div>
      </div>

            {/* Chat History Sidebar - Slide from right */}
      <div className={`fixed top-0 right-0 h-full bg-white/95 backdrop-blur-sm border-l border-gray-200/50 shadow-2xl transition-transform duration-300 ease-in-out z-30 ${showChatHistory ? 'translate-x-0' : 'translate-x-full'}`} style={{ width: '360px' }}>
        <div className="px-6 py-5.5 border-b border-gray-200/50 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 flex-shrink-0">
          <Button 
            onClick={handleNewChat} 
            className={`w-full justify-start gap-3 py-3 text-sm font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg transition-all duration-150 ${
              isNewChatButtonPressed 
                ? 'scale-95 shadow-xl shadow-blue-500/25' 
                : 'scale-100 shadow-lg'
            }`}
          >
            <Plus size={18} />
            Chat mới
          </Button>
        </div>

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-2">
              <h3 className="text-sm font-medium text-gray-500 mb-2 px-2">Lịch sử chat</h3>
              <div className="space-y-1">
                {chatSessions.map((session) => (
                  <div
                    key={session.id}
                    className={`group flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors ${currentSessionId === session.id ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50"
                      }`}
                    onClick={() => handleSelectSession(session.id)}
                  >
                    <MessageCircle size={16} className="flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{session.title}</p>
                      <p className="text-xs text-gray-500">{session.updatedAt.toLocaleDateString()}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      onClick={(e) => handleDeleteSession(session.id, e)}
                    >
                      <Trash2 size={12} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
