"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CALORIE_DATA, MACROS, NUTRIENTS, WEIGHT_DATA } from "@/lib/constants"

export default function ProfileScreen() {
  const calorieData = CALORIE_DATA
  const macros = MACROS
  const nutrients = NUTRIENTS
  const weightData = WEIGHT_DATA

  const caloriePercentage = (calorieData.current / calorieData.goal) * 100

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      <div className="p-6 bg-purple-50 border-b border-purple-200 flex-shrink-0">
        <h1 className="text-3xl font-bold text-purple-800">Hồ Sơ Sức Khỏe</h1>
        <p className="text-purple-600 mt-1">Theo dõi dinh dưỡng và sức khỏe của bạn</p>
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-6 space-y-6">
            {/* Calories and Macros Row */}
            <div className="grid grid-cols-2 gap-6">
              {/* Calories Donut Chart */}
              <Card className="p-6">
              <h3 className="text-xl font-semibold mb-6 text-gray-800">Calories</h3>
                <div className="text-center">
                  <div className="relative w-40 h-40 mx-auto mb-4">
                    <svg className="w-40 h-40 transform rotate-0" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="4"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="4"
                        strokeDasharray={`${caloriePercentage}, 100`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-800">{calorieData.current}</div>
                        <div className="text-sm text-gray-500">/ {calorieData.goal}</div>
                      </div>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-800">Calories</h3>
                  <p className="text-sm text-gray-600">Hôm nay</p>
                </div>
              </Card>

              {/* Combined Macro Charts */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-6 text-gray-800">Macros</h3>
                <div className="grid grid-cols-3 gap-4">
                  {macros.map((macro) => {
                    const percentage = (macro.current / macro.goal) * 100
                    return (
                      <div key={macro.name} className="text-center">
                        <div className="h-32 flex items-end justify-center mb-4">
                          <div className="w-6 h-full bg-gray-200 rounded-full relative overflow-hidden">
                            <div
                              className={`${macro.color} transition-all duration-500 absolute bottom-0 w-full`}
                              style={{
                                height: `${Math.max(percentage, 3)}%`,
                              }}
                            />
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-800">
                            {macro.current}
                            {macro.unit}
                          </div>
                          <div className="text-xs text-gray-500">
                            / {macro.goal}
                            {macro.unit}
                          </div>
                          <h4 className="font-semibold text-gray-800 mt-1 text-sm">{macro.name}</h4>
                          <div className="text-xs text-gray-400 mt-1">{percentage.toFixed(1)}%</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>
            </div>

            {/* Weight and Nutrients Row */}
            <div className="grid grid-cols-10 gap-6">
              {/* Weight Chart - 6 columns */}
              <div className="col-span-6">
                <Card className="p-6 h-full">
                  <h3 className="text-xl font-semibold mb-6 text-gray-800">Cân Nặng Theo Ngày</h3>
                  <div className="h-64 relative">
                    <svg className="w-full h-full" viewBox="0 0 700 240">
                      <defs>
                        <linearGradient id="weightGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
                        </linearGradient>
                      </defs>

                      {/* Grid lines */}
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <line
                          key={i}
                          x1="60"
                          y1={40 + i * 30}
                          x2="640"
                          y2={40 + i * 30}
                          stroke="#e5e7eb"
                          strokeWidth="1"
                        />
                      ))}

                      {/* Y-axis labels */}
                      {[71, 70.5, 70, 69.5, 69, 68.5].map((weight, i) => (
                        <text key={i} x="50" y={45 + i * 30} textAnchor="end" className="text-xs fill-gray-600">
                          {weight}kg
                        </text>
                      ))}

                      {/* Weight line and area */}
                      <path
                        d={`M 80 ${190 - (weightData[0].weight - 68.5) * 60} ${weightData
                          .map((point, index) => `L ${80 + index * 80} ${190 - (point.weight - 68.5) * 60}`)
                          .join(" ")}`}
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="3"
                      />

                      {/* Filled area */}
                      <path
                        d={`M 80 190 L 80 ${190 - (weightData[0].weight - 68.5) * 60} ${weightData
                          .map((point, index) => `L ${80 + index * 80} ${190 - (point.weight - 68.5) * 60}`)
                          .join(" ")} L ${80 + (weightData.length - 1) * 80} 190 Z`}
                        fill="url(#weightGradient)"
                      />

                      {/* Data points */}
                      {weightData.map((point, index) => (
                        <g key={index}>
                          <circle cx={80 + index * 80} cy={190 - (point.weight - 68.5) * 60} r="4" fill="#3b82f6" />
                          <text x={80 + index * 80} y={210} textAnchor="middle" className="text-xs fill-gray-600">
                            {point.day}
                          </text>
                          <text x={80 + index * 80} y={225} textAnchor="middle" className="text-xs fill-gray-500">
                            {point.date}
                          </text>
                        </g>
                      ))}
                    </svg>
                  </div>
                </Card>
              </div>

              {/* Nutrients Progress Bars - 4 columns */}
              <div className="col-span-4">
                <Card className="p-6 h-full">
                  <h3 className="text-xl font-semibold mb-6 text-gray-800">Chất Dinh Dưỡng</h3>
                  <ScrollArea className="h-64">
                    <div className="space-y-4">
                      {nutrients.map((nutrient) => (
                        <div key={nutrient.name}>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="font-medium text-gray-700">{nutrient.name}</span>
                            <span className="text-gray-600">
                              {nutrient.current}/{nutrient.goal} {nutrient.unit}
                            </span>
                          </div>
                          <Progress value={(nutrient.current / nutrient.goal) * 100} className="h-3" />
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </Card>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
