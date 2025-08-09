"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import FoodCard from "@/components/food-card"
import { CheckCircle, XCircle } from "lucide-react"
import { AVAILABLE_FOODS, UNAVAILABLE_FOODS } from "@/lib/constants"

const availableFoods = AVAILABLE_FOODS
const unavailableFoods = UNAVAILABLE_FOODS

export default function FoodScreen() {
  return (
    <div className="h-full bg-white flex flex-col">
      <div className="px-6 py-4 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-200/50 flex-shrink-0">
                    <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-800 to-amber-800 tracking-tight">Thực Đơn</h1>
            <p className="text-orange-600/80 mt-1 text-xs font-medium">Khám phá các món ăn bạn có thể làm</p>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="px-6 py-4 h-full">
          <Tabs defaultValue="du" className="h-full flex flex-col">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-4 flex-shrink-0">
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
                <div className="grid grid-cols-1 gap-4 pb-6">
                  {availableFoods.map((food) => (
                    <FoodCard
                      key={food.id}
                      id={food.id}
                      name={food.name}
                      image={food.image}
                      cookingTime={food.cookingTime}
                      difficulty={food.difficulty}
                      isAvailable={true}
                      calories={food.calories}
                      protein={food.protein}
                      carbs={food.carbs}
                      fat={food.fat}
                      onAdd={(id) => {
                        console.log("Adding food to calendar:", id)
                        // TODO: Implement add to calendar functionality
                      }}
                      onEdit={(id) => {
                        console.log("Editing food:", id)
                        // TODO: Implement edit functionality
                      }}
                      onDelete={(id) => {
                        console.log("Deleting food:", id)
                        // TODO: Implement delete functionality
                      }}
                    />
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="thieu" className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="grid grid-cols-1 gap-4 pb-6">
                  {unavailableFoods.map((food) => (
                    <FoodCard
                      key={food.id}
                      id={food.id}
                      name={food.name}
                      image={food.image}
                      cookingTime={food.cookingTime}
                      difficulty={food.difficulty}
                      isAvailable={false}
                      missingIngredients={food.missingIngredients}
                      calories={food.calories}
                      protein={food.protein}
                      carbs={food.carbs}
                      fat={food.fat}
                      onAdd={(id) => {
                        console.log("Adding food to calendar:", id)
                        // TODO: Implement add to calendar functionality
                      }}
                      onEdit={(id) => {
                        console.log("Editing food:", id)
                        // TODO: Implement edit functionality
                      }}
                      onDelete={(id) => {
                        console.log("Deleting food:", id)
                        // TODO: Implement delete functionality
                      }}
                    />
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
