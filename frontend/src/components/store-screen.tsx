"use client"

import { useState } from "react"
import { Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import FoodCard from "@/components/food-card"
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
      <div className="p-6 border-b bg-green-50 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-green-800">Kho Nguyên Liệu</h1>
            <p className="text-green-600 mt-1">Quản lý nguyên liệu và thực phẩm</p>
          </div>
        </div>

        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Tìm kiếm nguyên liệu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 py-3"
          />
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* Add New Card */}
              <Card
                className="overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg border-2 border-dashed border-green-300 bg-green-50 hover:bg-green-100"
                onClick={handleAddNew}
              >
                <div className="h-48 flex items-center justify-center">
                  <div className="w-16 h-16 bg-green-500 hover:bg-green-600 transition-colors duration-200 flex items-center justify-center rounded-lg">
                    <Plus size={32} className="text-white" />
                  </div>
                </div>
                <div className="h-20 flex items-center justify-center">
                  <p className="text-green-600 text-sm">Nhấn để thêm nguyên liệu mới</p>
                </div>
              </Card>

              {/* Food Items */}
              {filteredItems.map((item) => (
                <FoodCard key={item.id} {...item} onEdit={handleEdit} onDelete={handleDelete} />
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
