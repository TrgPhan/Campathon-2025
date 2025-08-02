"use client"

import { useState } from "react"
import { Plus, Search, Calendar, Package, Edit, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import FoodCard from "@/components/ingredient-card"
import { MOCK_FOOD_ITEMS } from "@/lib/constants"

const mockFoodItems = MOCK_FOOD_ITEMS

export default function StoreScreen() {
  const [foodItems, setFoodItems] = useState(mockFoodItems)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredItems = foodItems.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleEdit = (id: string) => {
    console.log("Edit item:", id)
    // Handle edit logic here
  }

  const handleDelete = (id: string) => {
    setFoodItems((items) => items.filter((item) => item.id !== id))
  }

  const handleAddNew = () => {
    console.log("Add new ingredient")
    // Handle add new ingredient logic here
  }

  return (
    <div className="h-full bg-white flex flex-col">
      <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200/50 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-800 to-emerald-800 tracking-tight">Kho Nguyên Liệu</h1>
            <p className="text-green-600/80 mt-1 text-xs font-medium">Quản lý nguyên liệu và thực phẩm</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-3 border-b bg-white flex-shrink-0">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Tìm kiếm nguyên liệu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 py-2"
          />
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {/* Add New Card */}
              <Card
                onClick={handleAddNew}
                className="group relative flex items-center justify-center h-full min-h-[300px] bg-gradient-to-br from-gray-50 to-gray-100 hover:from-green-50 hover:to-emerald-50 cursor-pointer transition-all duration-300 border border-dashed border-gray-200 hover:border-green-300/50 hover:shadow-xl rounded-lg"
              >
                <div className="text-center text-gray-400 group-hover:text-green-600 transition-colors duration-300">
                  <Plus size={36} className="mx-auto" />
                  <p className="mt-3 font-semibold text-sm">Thêm Nguyên Liệu</p>
                </div>
              </Card>

              {/* Food Items */}
              {filteredItems.map((food) => (
                <FoodCard
                  key={food.id}
                  id={food.id}
                  name={food.name}
                  image={food.image}
                  ingredients={food.ingredients}
                  manufacturingDate={food.manufacturingDate}
                  quantity={food.quantity}
                  unit={food.unit}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            {filteredItems.length === 0 && searchTerm && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Không tìm thấy nguyên liệu nào</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
