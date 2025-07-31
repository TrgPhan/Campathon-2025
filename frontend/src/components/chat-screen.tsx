"use client"

import { useState, useEffect } from "react"
import { Send, Bot, User, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import FoodCard from "@/components/food-card"
import { chatCache } from "@/lib/cache"
import { Message, TaskPrompt } from "@/lib/types"
import { TASK_PROMPTS, FOOD_SUGGESTIONS, TYPING_SPEED, TYPING_DELAY } from "@/lib/constants"

// Utility function to parse markdown-like formatting
const parseMarkdown = (text: string) => {
  // Bold: **text** -> <strong>text</strong>
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  
  // Italic: *text* -> <em>text</em>
  text = text.replace(/\*(.*?)\*/g, '<em>$1</em>')
  
  // Underline: __text__ -> <u>text</u>
  text = text.replace(/__(.*?)__/g, '<u>$1</u>')
  
  return text
}

const taskPrompts = TASK_PROMPTS

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>(() => {
    // Try to load from cache first
    const cachedMessages = chatCache.getChatHistory()
    if (cachedMessages) {
      return cachedMessages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }))
    }
    
    // Default welcome message
    return [
      {
        id: "1",
        text: "Xin chào! Tôi là trợ lý AI của bạn. Tôi có thể giúp bạn gợi ý món ăn, hướng dẫn nấu ăn và tư vấn sức khỏe. Bạn muốn tôi giúp gì hôm nay?",
        isBot: true,
        timestamp: new Date(),
        isTyping: false,
      },
    ]
  })
  const [inputText, setInputText] = useState("")
  const [currentTypingMessageId, setCurrentTypingMessageId] = useState<string | null>(null)
  const [typingText, setTypingText] = useState("")
  const [typingInterval, setTypingInterval] = useState<NodeJS.Timeout | null>(null)

  // Save messages to cache whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      chatCache.saveChatHistory(messages)
    }
  }, [messages])

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

  return (
    <div className="h-full bg-white flex">
      {/* Task Prompts Sidebar */}
      <div className="w-80 border-r border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Gợi Ý Câu Hỏi</h2>
        <div className="space-y-3">
          {taskPrompts.map((task) => (
            <Card
              key={task.id}
              className={`p-4 cursor-pointer transition-all duration-200 ${task.color}`}
              onClick={() => handleTaskClick(task)}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{task.icon}</span>
                <div className="flex-1">
                  <h3 className="font-medium text-sm mb-1">{task.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{task.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="p-6 bg-blue-50 border-b border-blue-200 flex-shrink-0">
          <h1 className="text-3xl font-bold text-blue-800">AI Chat Assistant</h1>
          <p className="text-blue-600 mt-1">Trò chuyện với AI để được hỗ trợ về ẩm thực và sức khỏe</p>
        </div>

        <ScrollArea className="flex-1 h-full overflow-hidden">
          <div className="p-6 space-y-4 max-w-4xl">
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
                         __html: message.isTyping && currentTypingMessageId === message.id 
                           ? parseMarkdown(typingText + '|')
                           : parseMarkdown(message.text)
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
                        <FoodCard key={food.id} {...food} onEdit={() => { }} onDelete={() => { }} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-6 border-t flex-shrink-0">
          <div className="flex gap-3 max-w-4xl">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Nhập tin nhắn của bạn..."
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1 py-3"
            />
            <Button onClick={handleSendMessage} className="px-6 py-3">
              <Send size={16} className="mr-2" />
              Gửi
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
