"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Plus } from "lucide-react"
import IngredientForm, { IngredientData } from "@/components/ingredient-form"

interface AddIngredientCardProps {
  onSave: (ingredient: IngredientData) => void
}

export default function AddIngredientCard({ onSave }: AddIngredientCardProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)

  const handleAddNew = () => {
    setIsFormOpen(true)
  }

  const handleSave = (ingredient: IngredientData) => {
    onSave(ingredient)
    setIsFormOpen(false)
  }

  return (
    <Card
      onClick={handleAddNew}
      className="group relative flex items-center justify-center h-full min-h-[300px] bg-gradient-to-br from-gray-50 to-gray-100 hover:from-green-50 hover:to-emerald-50 cursor-pointer transition-all duration-300 border border-dashed border-gray-200 hover:border-green-300/50 hover:shadow-xl rounded-lg overflow-hidden"
    >
      {!isFormOpen ? (
        <div className="text-center text-gray-400 group-hover:text-green-600 transition-colors duration-300">
          <Plus size={36} className="mx-auto" />
          <p className="mt-3 font-semibold text-sm">Thêm Nguyên Liệu</p>
        </div>
      ) : (
        <IngredientForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSave}
        />
      )}
    </Card>
  )
} 