"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Clock, Edit, Trash2, Plus, Flame, Beef, Wheat } from "lucide-react"

interface FoodCardProps {
  id: string
  name: string
  image: string
  cookingTime: string
  difficulty: string
  isAvailable: boolean
  missingIngredients?: string[]
  calories: number
  protein: number
  carbs: number
  fat: number
  onAdd?: (id: string) => void
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export default function FoodCard({
  id,
  name,
  image,
  cookingTime,
  difficulty,
  isAvailable,
  missingIngredients,
  calories,
  protein,
  carbs,
  fat,
  onAdd,
  onEdit,
  onDelete,
}: FoodCardProps) {
  const [isImageHovered, setIsImageHovered] = useState(false)
  const [isCardHovered, setIsCardHovered] = useState(false)
  const [isBlinking, setIsBlinking] = useState(false)

  // Mock current nutritional values (would come from user's daily intake)
  const currentCalories = 1200
  const currentProtein = 80
  const currentCarbs = 180
  const currentFat = 45

  // Daily goals
  const goalCalories = 2400
  const goalProtein = 150
  const goalCarbs = 320
  const goalFat = 100

  // Calculate progress percentages
  const caloriesProgress = Math.min((currentCalories / goalCalories) * 100, 100)
  const proteinProgress = Math.min((currentProtein / goalProtein) * 100, 100)
  const carbsProgress = Math.min((currentCarbs / goalCarbs) * 100, 100)
  const fatProgress = Math.min((currentFat / goalFat) * 100, 100)

  // Blinking animation effect for card hover
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isCardHovered) {
      interval = setInterval(() => {
        setIsBlinking((prev) => !prev)
      }, 600) // Blink every 600ms
    } else {
      setIsBlinking(false)
    }
    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isCardHovered])

  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer p-0"
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => setIsCardHovered(false)}
    >
      <div className="flex h-32">
        {/* Left side - Image with hover actions */}
        <div
          className="relative w-55 flex-shrink-0"
          onMouseEnter={() => setIsImageHovered(true)}
          onMouseLeave={() => setIsImageHovered(false)}
        >
          <img src={image || "/placeholder.svg"} alt={name} className="w-full h-full object-cover" />

          {/* Action buttons overlay on image hover */}
          {isImageHovered && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center gap-4">
              <div className="flex flex-col items-center gap-1">
                <Button
                  size="sm"
                  variant="secondary"
                  className="w-10 h-10 rounded-lg bg-green-500 hover:bg-green-600 text-white"
                  onClick={(e) => {
                    e.stopPropagation()
                    onAdd?.(id)
                  }}
                >
                  <Plus size={16} />
                </Button>
                <span className="text-xs text-white font-medium">Thêm</span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <Button
                  size="sm"
                  variant="secondary"
                  className="w-10 h-10 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={(e) => {
                    e.stopPropagation()
                    onEdit?.(id)
                  }}
                >
                  <Edit size={16} />
                </Button>
                <span className="text-xs text-white font-medium">Sửa</span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <Button
                  size="sm"
                  variant="secondary"
                  className="w-10 h-10 rounded-lg bg-red-500 hover:bg-red-600 text-white"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete?.(id)
                  }}
                >
                  <Trash2 size={16} />
                </Button>
                <span className="text-xs text-white font-medium">Xóa</span>
              </div>
            </div>
          )}
        </div>

        {/* Right side - Content */}
        <div className="flex-1 p-3 flex flex-col justify-between">
          {/* Title area */}
          <div className="mb-1">
            {isCardHovered ? (
              /* Macro progress bars on title hover */
              <div className="space-y-1">
                <h3 className="font-semibold text-base">{name}</h3>

                {/* Calories Progress */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-16">
                    <Flame size={14} className="text-orange-500" />
                    <span className="text-xs font-medium">Calo</span>
                  </div>
                  <div className="flex-1 relative h-2 bg-gray-200 rounded-full">
                    {/* Predicted addition (blinking) - behind current progress */}
                    <div
                      className={`absolute top-0 h-full bg-orange-300 rounded-full transition-all duration-300 ${isBlinking ? "opacity-80" : "opacity-40"
                        }`}
                      style={{
                        left: `${caloriesProgress}%`,
                        width: `${(calories + currentCalories / goalCalories) * 100}%`,
                      }}
                    />
                    <div
                      className="h-full bg-orange-500 rounded-full transition-all duration-300 relative z-10"
                      style={{ width: `${Math.min(caloriesProgress, 100)}%` }}
                    />
                  </div>
                  <span className={`text-xs font-bold ${isBlinking ? "text-orange-600" : "text-gray-500"}`}>
                    (+{calories})
                  </span>
                </div>

                {/* Protein Progress */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-16">
                    <Beef size={14} className="text-red-500" />
                    <span className="text-xs font-medium">Protein</span>
                  </div>
                  <div className="flex-1 relative h-2 bg-gray-200 rounded-full">
                    {/* Predicted addition (blinking) - behind current progress */}
                    <div
                      className={`absolute top-0 h-full bg-red-300 rounded-full transition-all duration-300 ${isBlinking ? "opacity-80" : "opacity-40"
                        }`}
                      style={{
                        left: `${proteinProgress}%`,
                        width: `${(protein + currentProtein / goalProtein) * 100}%`,
                      }}
                    />
                    <div
                      className="h-full bg-red-500 rounded-full transition-all duration-300 relative z-10"
                      style={{ width: `${Math.min(proteinProgress, 100)}%` }}
                    />
                  </div>
                  <span className={`text-xs font-bold ${isBlinking ? "text-red-600" : "text-gray-500"}`}>
                    (+{protein}g)
                  </span>
                </div>

                {/* Carbs Progress */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-16">
                    <Wheat size={14} className="text-blue-500" />
                    <span className="text-xs font-medium">Carbs</span>
                  </div>
                  <div className="flex-1 relative h-2 bg-gray-200 rounded-full">
                    {/* Predicted addition (blinking) - behind current progress */}
                    <div
                      className={`h-full bg-blue-300 rounded-full transition-all duration-300 ${isBlinking ? "opacity-80" : "opacity-40"
                        }`}
                      style={{
                        left: `${carbsProgress}%`,
                        width: `${(carbs + currentCarbs / goalCarbs) * 100}%`,
                      }}
                    />
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-300 relative z-10"
                      style={{ width: `${Math.min(carbsProgress, 100)}%` }}
                    />
                  </div>
                  <span className={`text-xs font-bold ${isBlinking ? "text-blue-600" : "text-gray-500"}`}>
                    (+{carbs}g)
                  </span>
                </div>

                {/* Fat Progress */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-16">
                    <Wheat size={14} className="text-blue-500" />
                    <span className="text-xs font-medium">Carbs</span>
                  </div>
                  <div className="flex-1 relative h-2 bg-gray-200 rounded-full">
                    {/* Predicted addition (blinking) - behind current progress */}
                    <div
                      className={`absolute top-0 h-full bg-blue-300 rounded-full transition-all duration-300 ${isBlinking ? "opacity-80" : "opacity-40"
                        }`}
                      style={{
                        left: `${fatProgress}%`,
                        width: `${(fat + currentFat / goalFat) * 100}%`,
                      }}
                    />
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-300 relative z-10"
                      style={{ width: `${Math.min(fatProgress, 100)}%` }}
                    />
                  </div>
                  <span className={`text-xs font-bold ${isBlinking ? "text-blue-600" : "text-gray-500"}`}>
                    (+{fat}g)
                  </span>
                </div>
              </div>
            ) : (
              /* Normal title display */
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-base">{name}</h3>

                  {/* Missing ingredients */}
                  {!isAvailable && missingIngredients && (
                    <div className="flex flex-wrap gap-1">
                      {missingIngredients.slice(0, 2).map((ingredient, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-red-200 text-red-600">
                          {ingredient}
                        </Badge>
                      ))}
                      {missingIngredients.length > 2 && (
                        <Badge variant="outline" className="text-xs border-red-200 text-red-600">
                          +{missingIngredients.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                {/* Nutritional info and cooking details */}
                <div className="flex items-center justify-between">
                  {/* Nutritional info */}
                  <div className="flex items-center gap-3 text-xs">
                    <div className="text-center">
                      <div className="text-xs text-gray-500">Calo</div>
                      <div className="font-semibold">{calories}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500">Protein</div>
                      <div className="font-semibold">{protein}g</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500">Carbs</div>
                      <div className="font-semibold">{carbs}g</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500">Fat</div>
                      <div className="font-semibold">{fat}g</div>
                    </div>
                  </div>

                  {/* Cooking info */}
                  <div className="flex items-center gap-3 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      {cookingTime}
                    </div>
                    <div className="font-medium">{difficulty}</div>
                  </div>
                </div>
              </div>
            )}
          </div>


        </div>
      </div>
    </Card>
  )
}
