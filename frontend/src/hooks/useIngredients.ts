import { useState, useEffect } from "react"
import { IngredientData } from "@/components/ingredient-form"
import { MOCK_FOOD_ITEMS } from "@/lib/constants"

export function useIngredients() {
  const [ingredients, setIngredients] = useState<IngredientData[]>([])

  // Load initial data
  useEffect(() => {
    setIngredients(MOCK_FOOD_ITEMS)
  }, [])

  // Add new ingredient
  const addIngredient = (ingredient: IngredientData) => {
    setIngredients(prev => [...prev, ingredient])
  }

  // Update existing ingredient
  const updateIngredient = (updatedIngredient: IngredientData) => {
    setIngredients(prev => 
      prev.map(item => 
        item.id === updatedIngredient.id ? updatedIngredient : item
      )
    )
  }

  // Delete ingredient
  const deleteIngredient = (id: string) => {
    setIngredients(prev => prev.filter(item => item.id !== id))
  }

  // Search ingredients
  const searchIngredients = (searchTerm: string) => {
    return ingredients.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  return {
    ingredients,
    addIngredient,
    updateIngredient,
    deleteIngredient,
    searchIngredients
  }
} 