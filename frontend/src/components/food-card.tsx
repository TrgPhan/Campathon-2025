"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock } from "lucide-react"

interface FoodCardProps {
  id: string
  name: string
  image: string
  cookingTime: string
  difficulty: string
  isAvailable: boolean
  missingIngredients?: string[]
}

export default function FoodCard({ id, name, image, cookingTime, difficulty, isAvailable, missingIngredients }: FoodCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
      {isAvailable ? (
        // Available food card
        <>
          <img
            src={image || "/placeholder.svg"}
            alt={name}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2">{name}</h3>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <CheckCircle size={12} className="mr-1" />
                Đủ nguyên liệu
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock size={14} />
                {cookingTime}
              </div>
              <div className="font-medium">{difficulty}</div>
            </div>
          </div>
        </>
      ) : (
        // Unavailable food card
        <>
          <div className="relative">
            <img
              src={image || "/placeholder.svg"}
              alt={name}
              className="w-full h-48 object-cover opacity-75"
            />
            <div className="absolute top-2 right-2">
              <Badge variant="destructive">
                <XCircle size={12} className="mr-1" />
                Thiếu nguyên liệu
              </Badge>
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2">{name}</h3>
            <div className="mb-3">
              <p className="text-sm text-red-600 font-medium mb-1">Thiếu:</p>
              <div className="flex flex-wrap gap-1">
                {missingIngredients?.map((ingredient, index) => (
                  <Badge key={index} variant="outline" className="text-xs border-red-200 text-red-600">
                    {ingredient}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock size={14} />
                {cookingTime}
              </div>
              <div className="font-medium">{difficulty}</div>
            </div>
          </div>
        </>
      )}
    </Card>
  )
}
