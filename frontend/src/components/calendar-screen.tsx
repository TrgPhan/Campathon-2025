"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { MONTH_NAMES, DAY_NAMES, MEAL_PLANS, AVAILABLE_FOODS, DAILY_MACROS } from "@/lib/constants"
import type { Macro } from "@/lib/types"

export default function CalendarScreen() {
  const [currentDate, setCurrentDate] = useState(new Date())

  const monthNames = MONTH_NAMES
  const dayNames = DAY_NAMES
  const mealPlans = MEAL_PLANS

  // Use daily macros data from constants
  const dailyMacros = DAILY_MACROS

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1))
  }

  return (
    <div className="h-full bg-white flex flex-col">
      <div className="px-6 py-4 bg-gradient-to-r from-red-50 to-rose-50 border-b border-red-200/50 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-800 to-rose-800 tracking-tight">Lịch Ăn Uống</h1>
            <p className="text-red-600/80 mt-1 text-xs font-medium">Lên kế hoạch bữa ăn hàng ngày</p>
          </div>
          <Button className="px-4 py-2">
            <Plus size={14} className="mr-2" />
            Thêm Kế Hoạch
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="px-6 py-4">
            {/* Daily Meal Schedule */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Lịch Ăn Uống Hôm Nay</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Sáng */}
                <Card className="p-4">
                  <h3 className="font-semibold text-orange-600 mb-3 flex items-center gap-2">
                    <span className="text-lg">🌅</span>
                    Sáng
                  </h3>
                  <div className="space-y-2">
                    {AVAILABLE_FOODS.slice(0, 2).map((food) => (
                      <div key={food.id} className="p-2 bg-orange-50 rounded border border-orange-200">
                    <div className="flex items-center gap-2">
                          <img src={food.image} alt={food.name} className="w-8 h-8 rounded object-cover" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">{food.name}</p>
                            <p className="text-xs text-gray-600">{food.cookingTime}</p>
                          </div>
                        </div>
                    </div>
                    ))}
                  </div>
                </Card>

                {/* Trưa */}
                <Card className="p-4">
                  <h3 className="font-semibold text-green-600 mb-3 flex items-center gap-2">
                    <span className="text-lg">🌞</span>
                    Trưa
                  </h3>
                  <div className="space-y-2">
                    {AVAILABLE_FOODS.slice(1, 3).map((food) => (
                      <div key={food.id} className="p-2 bg-green-50 rounded border border-green-200">
                        <div className="flex items-center gap-2">
                          <img src={food.image} alt={food.name} className="w-8 h-8 rounded object-cover" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">{food.name}</p>
                            <p className="text-xs text-gray-600">{food.cookingTime}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Chiều */}
                <Card className="p-4">
                  <h3 className="font-semibold text-blue-600 mb-3 flex items-center gap-2">
                    <span className="text-lg">🌤️</span>
                    Chiều
                  </h3>
                  <div className="space-y-2">
                    {AVAILABLE_FOODS.slice(2, 4).map((food) => (
                      <div key={food.id} className="p-2 bg-blue-50 rounded border border-blue-200">
                        <div className="flex items-center gap-2">
                          <img src={food.image} alt={food.name} className="w-8 h-8 rounded object-cover" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">{food.name}</p>
                            <p className="text-xs text-gray-600">{food.cookingTime}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Tối */}
                <Card className="p-4">
                  <h3 className="font-semibold text-purple-600 mb-3 flex items-center gap-2">
                    <span className="text-lg">🌙</span>
                    Tối
                  </h3>
                  <div className="space-y-2">
                    {AVAILABLE_FOODS.slice(0, 2).map((food) => (
                      <div key={food.id} className="p-2 bg-purple-50 rounded border border-purple-200">
                        <div className="flex items-center gap-2">
                          <img src={food.image} alt={food.name} className="w-8 h-8 rounded object-cover" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">{food.name}</p>
                            <p className="text-xs text-gray-600">{food.cookingTime}</p>
                            </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
              </div>

            {/* Weekly Progress */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Tiến Độ Tuần</h2>
              <div className="grid grid-cols-7 gap-4">
                {Object.entries(dailyMacros).map(([day, macros]) => (
                  <Card key={day} className="p-4">
                    <h3 className="text-center font-semibold text-gray-800 mb-3">{day}</h3>
                    <div className="space-y-2">
                      {macros.map((macro) => {
                        const percentage = (macro.current / macro.goal) * 100
                        return (
                          <div key={macro.name} className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-600">{macro.name}</span>
                              <span className="text-gray-800">{macro.current}/{macro.goal}{macro.unit}</span>
                      </div>
                            <Progress value={percentage} className="h-2" />
                      </div>
                        )
                      })}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
