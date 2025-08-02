"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Calendar, Package } from "lucide-react"

interface IngredientCardProps {
  id: string
  name: string
  image: string
  ingredients: string[]
  manufacturingDate?: Date
  quantity?: number
  unit?: string
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export default function IngredientCard({ id, name, image, ingredients, manufacturingDate, quantity, unit, onEdit, onDelete }: IngredientCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={image}
        alt={name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        {isHovered ? (
          /* Mouseover Actions - Shown on hover */
          <div className="flex items-center justify-center gap-8 h-32">
            <div className="flex flex-col items-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                className="w-20 h-20 rounded-lg bg-blue-50 hover:bg-blue-100"
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit?.(id)
                }}
              >
                <Edit size={20} className="text-blue-600" />
              </Button>
              <span className="text-sm text-gray-600 font-medium">Sửa</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                className="w-20 h-20 rounded-lg bg-red-50 hover:bg-red-100"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete?.(id)
                }}
              >
                <Trash2 size={20} className="text-red-600" />
              </Button>
              <span className="text-sm text-gray-600 font-medium">Xóa</span>
            </div>
          </div>
        ) : (
          /* Content - Shown when not hovered */
          <>
            <h3 className="font-semibold text-lg mb-2">{name}</h3>
            
            {/* Storage Information */}
            <div className="space-y-2 mb-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar size={14} />
                <span>NSX: {manufacturingDate?.toLocaleDateString('vi-VN')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Package size={14} />
                <span>SL: {quantity} {unit}</span>
              </div>
            </div>

            {/* Ingredients - 2 columns */}
            <div className="text-sm text-gray-600">
              <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="truncate">
                    • {ingredient}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  )
}
