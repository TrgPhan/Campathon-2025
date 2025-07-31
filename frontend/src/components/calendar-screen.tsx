"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MONTH_NAMES, DAY_NAMES, MEAL_PLANS } from "@/lib/constants"

export default function CalendarScreen() {
  const [currentDate, setCurrentDate] = useState(new Date())

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

  const monthNames = MONTH_NAMES
  const dayNames = DAY_NAMES
  const mealPlans = MEAL_PLANS

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1))
  }

  return (
    <div className="h-full bg-white flex flex-col">
      <div className="p-6 bg-red-50 border-b border-red-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-red-800">Lịch Ăn Uống</h1>
            <p className="text-red-600 mt-1">Lên kế hoạch bữa ăn hàng ngày</p>
          </div>
          <Button className="px-6 py-3">
            <Plus size={16} className="mr-2" />
            Thêm Kế Hoạch
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Calendar */}
              <div className="lg:col-span-2">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h2>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => navigateMonth(-1)}>
                        <ChevronLeft size={16} />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => navigateMonth(1)}>
                        <ChevronRight size={16} />
                      </Button>
                    </div>
                  </div>

                  {/* Day headers */}
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {dayNames.map((day) => (
                      <div key={day} className="text-center text-sm font-medium text-gray-600 p-3">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar grid */}
                  <div className="grid grid-cols-7 gap-2">
                    {/* Empty cells for days before month starts */}
                    {Array.from({ length: firstDayOfMonth }, (_, i) => (
                      <div key={`empty-${i}`} className="h-20" />
                    ))}

                    {/* Days of the month */}
                    {Array.from({ length: daysInMonth }, (_, i) => {
                      const day = i + 1
                      const hasMealPlan = mealPlans[day as keyof typeof mealPlans]
                      const isToday =
                        day === new Date().getDate() &&
                        currentDate.getMonth() === new Date().getMonth() &&
                        currentDate.getFullYear() === new Date().getFullYear()

                      return (
                        <div
                          key={day}
                          className={`h-20 border-2 rounded-lg flex flex-col items-center justify-center text-sm relative cursor-pointer hover:bg-gray-50 transition-colors ${
                            isToday ? "bg-blue-50 border-blue-300" : "border-gray-200"
                          }`}
                        >
                          <span className={`font-medium ${isToday ? "text-blue-600" : "text-gray-700"}`}>{day}</span>
                          {hasMealPlan && (
                            <div className="absolute bottom-1 left-1 right-1 flex gap-1">
                              <div className="flex-1 h-1 bg-orange-400 rounded-full" />
                              <div className="flex-1 h-1 bg-green-400 rounded-full" />
                              <div className="flex-1 h-1 bg-purple-400 rounded-full" />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </Card>
              </div>

              {/* Meal Plans */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Kế Hoạch Ăn Uống</h3>
                {Object.entries(mealPlans).map(([day, meals]) => (
                  <Card key={day} className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600">{day}</span>
                      </div>
                      <div className="font-medium text-gray-800">
                        {monthNames[currentDate.getMonth()]} {day}
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                        <span className="text-gray-600">Sáng:</span>
                        <span className="font-medium">{meals.breakfast}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        <span className="text-gray-600">Trưa:</span>
                        <span className="font-medium">{meals.lunch}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                        <span className="text-gray-600">Tối:</span>
                        <span className="font-medium">{meals.dinner}</span>
                      </div>
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
