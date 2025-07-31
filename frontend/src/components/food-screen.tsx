"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AVAILABLE_FOODS, UNAVAILABLE_FOODS } from "@/lib/constants"

const availableFoods = AVAILABLE_FOODS
const unavailableFoods = UNAVAILABLE_FOODS

export default function FoodScreen() {
  return (
    <div className="h-full bg-white flex flex-col">
      <div className="p-6 bg-orange-50 border-b border-orange-200 flex-shrink-0">
        <h1 className="text-3xl font-bold text-orange-800">Thực Đơn</h1>
        <p className="text-orange-600 mt-1">Khám phá các món ăn bạn có thể làm</p>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="p-6 h-full">
          <Tabs defaultValue="du" className="h-full flex flex-col">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-6 flex-shrink-0">
              <TabsTrigger value="du" className="text-green-600 data-[state=active]:bg-green-50">
                <CheckCircle size={16} className="mr-2" />
                ĐỦ NGUYÊN LIỆU
              </TabsTrigger>
              <TabsTrigger value="thieu" className="text-red-600 data-[state=active]:bg-red-50">
                <XCircle size={16} className="mr-2" />
                THIẾU NGUYÊN LIỆU
              </TabsTrigger>
            </TabsList>

            <TabsContent value="du" className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
                  {availableFoods.map((food) => (
                    <Card key={food.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                      <img
                        src={food.image || "/placeholder.svg"}
                        alt={food.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{food.name}</h3>
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <CheckCircle size={12} className="mr-1" />
                            Đủ nguyên liệu
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            {food.cookingTime}
                          </div>
                          <div className="font-medium">{food.difficulty}</div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="thieu" className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
                  {unavailableFoods.map((food) => (
                    <Card key={food.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="relative">
                        <img
                          src={food.image || "/placeholder.svg"}
                          alt={food.name}
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
                        <h3 className="font-semibold text-lg mb-2">{food.name}</h3>
                        <div className="mb-3">
                          <p className="text-sm text-red-600 font-medium mb-1">Thiếu:</p>
                          <div className="flex flex-wrap gap-1">
                            {food.missingIngredients.map((ingredient, index) => (
                              <Badge key={index} variant="outline" className="text-xs border-red-200 text-red-600">
                                {ingredient}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            {food.cookingTime}
                          </div>
                          <div className="font-medium">{food.difficulty}</div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
