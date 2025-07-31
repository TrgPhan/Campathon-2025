// Chat related types
export interface Message {
  id: string
  text: string
  isBot: boolean
  timestamp: Date
  isTyping: boolean
  foodSuggestions?: Array<{ id: string; name: string; image: string; ingredients: string[] }>
}

export interface FoodItem {
  id: string
  name: string
  image: string
  ingredients: string[]
}

export interface FoodSuggestion {
  id: string
  name: string
  image: string
  ingredients: string[]
}

export interface TaskPrompt {
  id: string
  title: string
  description: string
  icon: string
  color: string
}

// Cache related types
export interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number // time to live in milliseconds
}

// Profile related types
export interface CalorieData {
  current: number
  goal: number
}

export interface Macro {
  name: string
  current: number
  goal: number
  color: string
  unit: string
}

export interface Nutrient {
  name: string
  current: number
  goal: number
  unit: string
}

export interface WeightData {
  day: string
  weight: number
  date: string
}

// Food screen types
export interface FoodItemWithDetails {
  id: string
  name: string
  image: string
  missingIngredients: string[]
  cookingTime: string
  difficulty: string
}

// Navigation types
export interface NavigationItem {
  id: string
  label: string
  icon: any
  color: string
} 