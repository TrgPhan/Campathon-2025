"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Save, Plus, Calendar } from "lucide-react"

interface IngredientFormProps {
  isOpen: boolean
  onClose: () => void
  onSave: (ingredient: IngredientData) => void
  editData?: IngredientData
}

export interface IngredientData {
  id: string
  name: string
  image: string
  ingredients: string[]
  manufacturingDate: Date
  quantity: number
  unit: string
}

export default function IngredientForm({ isOpen, onClose, onSave, editData }: IngredientFormProps) {
  const [formData, setFormData] = useState<IngredientData>({
    id: "",
    name: "",
    image: "",
    ingredients: [],
    manufacturingDate: new Date(),
    quantity: 0,
    unit: ""
  })

  useEffect(() => {
    if (editData) {
      setFormData(editData)
    } else {
      setFormData({
        id: "",
        name: "",
        image: "",
        ingredients: [],
        manufacturingDate: new Date(),
        quantity: 0,
        unit: ""
      })
    }
  }, [editData, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const dataToSave = {
      ...formData,
      id: editData?.id || `ingredient-${Date.now()}`,
      ingredients: formData.ingredients.filter(ing => ing.trim() !== "")
    }
    onSave(dataToSave)
    onClose()
  }

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, ""]
    }))
  }

  const updateIngredient = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) => i === index ? value : ing)
    }))
  }

  const removeIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }))
  }

  if (!isOpen) return null

  return (
    <div className="absolute inset-0 bg-white rounded-lg shadow-lg z-10 flex flex-col">
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold">
            {editData ? "Sửa" : "Thêm mới"}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
            <X size={14} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-8 gap-2">
            <div className="col-span-3">
              <div className="text-xs font-medium mb-1">Tên</div>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Tên nguyên liệu"
                className="h-8 text-sm"
                required
              />
            </div>
            <div className="col-span-3">
              <div className="text-xs font-medium mb-1">SL</div>
              <Input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                placeholder="0"
                className="h-8 text-sm"
                required
              />
            </div>
            <div className="col-span-2">
              <div className="text-xs font-medium mb-1">Đơn vị</div>
              <Input
                value={formData.unit}
                onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                placeholder="kg"
                className="h-8 text-sm"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs font-medium mb-1">URL ảnh</div>
              <Input
                value={formData.image}
                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                placeholder="https://..."
                className="h-8 text-sm"
                required
              />
            </div>
            <div>
              <div className="text-xs font-medium mb-1">Hạn</div>
              <div className="relative">
                <Calendar size={14} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                <Input
                  type="date"
                  value={formData.manufacturingDate.toISOString().split('T')[0]}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    manufacturingDate: new Date(e.target.value) 
                  }))}
                  className="h-8 text-sm pl-8"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs font-medium mb-2">Thành phần</div>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
              <button
                type="button"
                onClick={addIngredient}
                className="inline-flex items-center justify-center w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors"
              >
                <Plus size={14} className="text-gray-600" />
              </button>
              {formData.ingredients.map((ingredient, index) => (
                <div
                  key={index}
                  className="inline-flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1 text-xs min-w-0"
                >
                  <input
                    type="text"
                    value={ingredient}
                    onChange={(e) => updateIngredient(index, e.target.value)}
                    className="bg-transparent border-none outline-none text-xs min-w-0 flex-1"
                    style={{ width: `${Math.max(ingredient.length * 6, 20)}px` }}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addIngredient()
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="ml-1 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </form>
      </div>
      
      <div className="p-4 border-t bg-gray-50">
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1 h-8 text-xs">
            Hủy
          </Button>
          <Button type="submit" onClick={handleSubmit} className="flex-1 h-8 text-xs">
            <Save size={12} className="mr-1" />
            {editData ? "Cập nhật" : "Lưu"}
          </Button>
        </div>
      </div>
    </div>
  )
} 