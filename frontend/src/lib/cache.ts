import { CacheItem, ChatSession, Message } from "./types"
import { CACHE_TTL, CACHE_CLEANUP_INTERVAL } from "./constants"

class Cache {
  private cache = new Map<string, CacheItem<any>>()
  private readonly DEFAULT_TTL = CACHE_TTL

  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    })
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key)
    
    if (!item) {
      return null
    }

    // Check if item has expired
    const now = Date.now()
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  has(key: string): boolean {
    const item = this.cache.get(key)
    
    if (!item) {
      return false
    }

    // Check if item has expired
    const now = Date.now()
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return false
    }

    return true
  }

  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  // Get all valid keys
  keys(): string[] {
    const now = Date.now()
    const validKeys: string[] = []

    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp <= item.ttl) {
        validKeys.push(key)
      } else {
        this.cache.delete(key)
      }
    }

    return validKeys
  }

  // Get cache size (only valid items)
  size(): number {
    const now = Date.now()
    let count = 0

    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp <= item.ttl) {
        count++
      } else {
        this.cache.delete(key)
      }
    }

    return count
  }

  // Clean expired items
  cleanup(): void {
    const now = Date.now()
    
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key)
      }
    }
  }
}

// Chat history specific cache
export class ChatCache extends Cache {
  private readonly CHAT_HISTORY_KEY = 'chat_history'
  private readonly CHAT_SETTINGS_KEY = 'chat_settings'

  // Save chat history
  saveChatHistory(messages: any[]): void {
    this.set(this.CHAT_HISTORY_KEY, messages)
  }

  // Get chat history
  getChatHistory(): any[] | null {
    return this.get(this.CHAT_HISTORY_KEY)
  }

  // Save chat settings
  saveChatSettings(settings: any): void {
    this.set(this.CHAT_SETTINGS_KEY, settings)
  }

  // Get chat settings
  getChatSettings(): any | null {
    return this.get(this.CHAT_SETTINGS_KEY)
  }

  // Clear chat history
  clearChatHistory(): void {
    this.delete(this.CHAT_HISTORY_KEY)
  }

  // Clear all chat data
  clearChatData(): void {
    this.delete(this.CHAT_HISTORY_KEY)
    this.delete(this.CHAT_SETTINGS_KEY)
  }
}

// Chat session management using localStorage
export class ChatSessionManager {
  private readonly CHAT_SESSIONS_KEY = "food_app_chat_sessions"
  private readonly CURRENT_SESSION_KEY = "food_app_current_session"

  // Get all chat sessions
  getAllSessions(): ChatSession[] {
    if (typeof window === "undefined") return []

    try {
      const sessions = localStorage.getItem(this.CHAT_SESSIONS_KEY)
      if (!sessions) return []

      return JSON.parse(sessions).map((session: any) => ({
        ...session,
        createdAt: new Date(session.createdAt),
        updatedAt: new Date(session.updatedAt),
        messages: session.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })),
      }))
    } catch (error) {
      console.error("Error loading chat sessions:", error)
      return []
    }
  }

  // Save all chat sessions
  saveSessions(sessions: ChatSession[]): void {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem(this.CHAT_SESSIONS_KEY, JSON.stringify(sessions))
    } catch (error) {
      console.error("Error saving chat sessions:", error)
    }
  }

  // Create new chat session
  createNewSession(): ChatSession {
    const newSession: ChatSession = {
      id: `session-${Date.now()}-${Math.random()}`,
      title: "Chat mới",
      messages: [
        {
          id: "welcome-1",
          text: "Xin chào! Tôi là trợ lý AI của bạn. Tôi có thể giúp bạn gợi ý món ăn, hướng dẫn nấu ăn và tư vấn sức khỏe. Bạn muốn tôi giúp gì hôm nay?",
          isBot: true,
          timestamp: new Date(),
          isTyping: false,
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const sessions = this.getAllSessions()
    sessions.unshift(newSession) // Add to beginning
    this.saveSessions(sessions)
    this.setCurrentSession(newSession.id)

    return newSession
  }

  // Update existing session
  updateSession(sessionId: string, messages: Message[]): void {
    const sessions = this.getAllSessions()
    const sessionIndex = sessions.findIndex((s) => s.id === sessionId)

    if (sessionIndex !== -1) {
      sessions[sessionIndex].messages = messages
      sessions[sessionIndex].updatedAt = new Date()

      // Auto-generate title from first user message
      const firstUserMessage = messages.find((m) => !m.isBot && m.text.trim())
      if (firstUserMessage && sessions[sessionIndex].title === "Chat mới") {
        sessions[sessionIndex].title =
          firstUserMessage.text.slice(0, 30) + (firstUserMessage.text.length > 30 ? "..." : "")
      }

      this.saveSessions(sessions)
    }
  }

  // Delete session
  deleteSession(sessionId: string): void {
    const sessions = this.getAllSessions()
    const filteredSessions = sessions.filter((s) => s.id !== sessionId)
    this.saveSessions(filteredSessions)

    // If current session was deleted, clear it
    if (this.getCurrentSessionId() === sessionId) {
      this.clearCurrentSession()
    }
  }

  // Get current session ID
  getCurrentSessionId(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem(this.CURRENT_SESSION_KEY)
  }

  // Set current session
  setCurrentSession(sessionId: string): void {
    if (typeof window === "undefined") return
    localStorage.setItem(this.CURRENT_SESSION_KEY, sessionId)
  }

  // Clear current session
  clearCurrentSession(): void {
    if (typeof window === "undefined") return
    localStorage.removeItem(this.CURRENT_SESSION_KEY)
  }

  // Get session by ID
  getSession(sessionId: string): ChatSession | null {
    const sessions = this.getAllSessions()
    return sessions.find((s) => s.id === sessionId) || null
  }
}

// Create global cache instance
export const chatCache = new ChatCache()
export const chatSessionManager = new ChatSessionManager()

// Auto cleanup every 5 minutes
setInterval(() => {
  chatCache.cleanup()
}, CACHE_CLEANUP_INTERVAL)

export default Cache 