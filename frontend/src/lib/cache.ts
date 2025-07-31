import { CacheItem } from "./types"
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

// Create global cache instance
export const chatCache = new ChatCache()

// Auto cleanup every 5 minutes
setInterval(() => {
  chatCache.cleanup()
}, CACHE_CLEANUP_INTERVAL)

export default Cache 