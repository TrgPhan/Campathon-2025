"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"

interface FoodCardProps {
  id: string
  name: string
  image: string
  ingredients: string[]
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export default function FoodCard({ id, name, image, ingredients, onEdit, onDelete }: FoodCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Card
      className="overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-48">
        <img src={image || "/placeholder.svg"} alt={name} className="w-full h-full object-cover" />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
          <h3 className="text-white font-medium text-lg">{name}</h3>
        </div>
      </div>

      <div className="h-20 relative overflow-hidden">
        <div
          className={`absolute inset-0 p-3 transition-transform duration-300 ${
            isHovered ? "-translate-y-full" : "translate-y-0"
          }`}
        >
          <div className="text-sm text-gray-600 space-y-1">
            {ingredients.slice(0, 3).map((ingredient, index) => (
              <div key={index} className="truncate">
                • {ingredient}
              </div>
            ))}
            {ingredients.length > 3 && <div className="text-xs text-gray-500">+{ingredients.length - 3} more...</div>}
          </div>
        </div>

        <div
          className={`absolute inset-0 p-3 flex items-center justify-center gap-4 transition-transform duration-300 ${
            isHovered ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <Button size="sm" variant="outline" onClick={() => onEdit?.(id)} className="h-10 px-4">
            <Edit size={16} className="mr-2" />
            Sửa
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete?.(id)}
            className="h-10 px-4 text-red-500 hover:text-red-600"
          >
            <Trash2 size={16} className="mr-2" />
            Xóa
          </Button>
        </div>
      </div>
    </Card>
  )
}
