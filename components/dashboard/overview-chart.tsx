"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState } from "react"

// Mock data for the chart
const monthlyData = [
  { month: "Jan", expenses: 2400, income: 4000 },
  { month: "Fev", expenses: 1398, income: 3000 },
  { month: "Mar", expenses: 9800, income: 2000 },
  { month: "Abr", expenses: 3908, income: 2780 },
  { month: "Mai", expenses: 4800, income: 1890 },
  { month: "Jun", expenses: 3800, income: 2390 },
]

export function OverviewChart() {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("monthly")

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Visão geral</CardTitle>
          <CardDescription>Acompanhe suas receitas e despesas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">Carregando gráfico...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Visão geral</CardTitle>
            <CardDescription>Acompanhe suas receitas e despesas</CardDescription>
          </div>
          <Tabs defaultValue="monthly" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="weekly">Semanal</TabsTrigger>
              <TabsTrigger value="monthly">Mensal</TabsTrigger>
              <TabsTrigger value="yearly">Anual</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <svg width="100%" height="100%" viewBox="0 0 600 300">
            {/* X and Y axes */}
            <line x1="50" y1="250" x2="550" y2="250" stroke="currentColor" strokeOpacity="0.2" />
            <line x1="50" y1="50" x2="50" y2="250" stroke="currentColor" strokeOpacity="0.2" />

            {/* X-axis labels */}
            {monthlyData.map((entry, index) => (
              <text
                key={`x-label-${index}`}
                x={50 + (index * 500) / (monthlyData.length - 1)}
                y="270"
                textAnchor="middle"
                fontSize="12"
                fill="currentColor"
                opacity="0.7"
              >
                {entry.month}
              </text>
            ))}

            {/* Y-axis labels */}
            {[0, 2500, 5000, 7500, 10000].map((value, index) => (
              <text
                key={`y-label-${index}`}
                x="40"
                y={250 - (index * 200) / 4}
                textAnchor="end"
                fontSize="12"
                fill="currentColor"
                opacity="0.7"
              >
                {value}
              </text>
            ))}

            {/* Income line */}
            <path
              d={`M${monthlyData
                .map(
                  (entry, index) =>
                    `${index === 0 ? "M" : "L"} ${50 + (index * 500) / (monthlyData.length - 1)} ${250 - (entry.income * 200) / 10000}`,
                )
                .join(" ")}`}
              fill="none"
              stroke="#22c55e"
              strokeWidth="2"
            />

            {/* Expense line */}
            <path
              d={`M${monthlyData
                .map(
                  (entry, index) =>
                    `${index === 0 ? "M" : "L"} ${50 + (index * 500) / (monthlyData.length - 1)} ${250 - (entry.expenses * 200) / 10000}`,
                )
                .join(" ")}`}
              fill="none"
              stroke="#ef4444"
              strokeWidth="2"
            />

            {/* Data points for income */}
            {monthlyData.map((entry, index) => (
              <circle
                key={`income-point-${index}`}
                cx={50 + (index * 500) / (monthlyData.length - 1)}
                cy={250 - (entry.income * 200) / 10000}
                r="4"
                fill="#22c55e"
              />
            ))}

            {/* Data points for expenses */}
            {monthlyData.map((entry, index) => (
              <circle
                key={`expense-point-${index}`}
                cx={50 + (index * 500) / (monthlyData.length - 1)}
                cy={250 - (entry.expenses * 200) / 10000}
                r="4"
                fill="#ef4444"
              />
            ))}

            {/* Legend */}
            <circle cx="450" cy="30" r="4" fill="#22c55e" />
            <text x="460" y="35" fontSize="12" fill="currentColor">
              Receitas
            </text>
            <circle cx="520" cy="30" r="4" fill="#ef4444" />
            <text x="530" y="35" fontSize="12" fill="currentColor">
              Despesas
            </text>
          </svg>
        </div>
      </CardContent>
    </Card>
  )
}

