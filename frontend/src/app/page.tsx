"use client"

import { useState } from "react"
import { Package, UtensilsCrossed, MessageCircle, Calendar, User } from "lucide-react"
import StoreScreen from "@/components/store-screen"
import FoodScreen from "@/components/food-screen"
import ChatScreen from "@/components/chat-screen"
import CalendarScreen from "@/components/calendar-screen"
import ProfileScreen from "@/components/profile-screen"
import { NAVIGATION_ITEMS } from "@/lib/constants"

const navigationItems = [
  { id: "storage", label: "STORAGE", icon: Package, color: NAVIGATION_ITEMS[0].color },
  { id: "food", label: "FOOD", icon: UtensilsCrossed, color: NAVIGATION_ITEMS[1].color },
  { id: "chat", label: "CHAT", icon: MessageCircle, color: NAVIGATION_ITEMS[2].color },
  { id: "calendar", label: "CALENDAR", icon: Calendar, color: NAVIGATION_ITEMS[3].color },
  { id: "profile", label: "PROFILE", icon: User, color: NAVIGATION_ITEMS[4].color },
]

export default function FoodApp() {
  const [activeTab, setActiveTab] = useState("storage")

  const renderContent = () => {
    switch (activeTab) {
      case "storage":
        return <StoreScreen />
      case "food":
        return <FoodScreen />
      case "chat":
        return <ChatScreen />
      case "calendar":
        return <CalendarScreen />
      case "profile":
        return <ProfileScreen />
      default:
        return <StoreScreen />
    }
  }

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200/50 bg-gradient-to-r from-gray-50 to-slate-50 flex-shrink-0">
          <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-slate-800 tracking-tight">Food Manager</h1>
          <p className="text-gray-600/80 mt-1 text-xs font-medium">Quản lý thực phẩm thông minh</p>
        </div>

        <nav className="flex-1 px-4 py-3">
          <ul className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                      activeTab === item.id
                        ? "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-900 font-semibold shadow-sm"
                        : "text-gray-600 hover:bg-gray-50/80 hover:text-gray-900"
                    }`}
                  >
                    <Icon size={18} className={activeTab === item.id ? item.color : "text-gray-500"} />
                    <span className="text-sm">{item.label}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="px-4 py-3 border-t border-gray-200/50">
          <div className="text-xs text-gray-500/80 text-center">© 2024 Food Manager</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen">{renderContent()}</div>
    </div>
  )
}
