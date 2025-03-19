import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Plane, ShoppingBag, Home } from "lucide-react"

// Mock data for financial goals
const goals = [
  {
    id: 1,
    name: "Viagem para a praia",
    current: 2500,
    target: 5000,
    icon: Plane,
    dueDate: "Julho 2025",
  },
  {
    id: 2,
    name: "Novo notebook",
    current: 3200,
    target: 4000,
    icon: ShoppingBag,
    dueDate: "Maio 2025",
  },
  {
    id: 3,
    name: "Entrada apartamento",
    current: 15000,
    target: 50000,
    icon: Home,
    dueDate: "Dezembro 2026",
  },
]

export function FinancialGoals() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Objetivos financeiros</CardTitle>
        <CardDescription>Acompanhe o progresso das suas metas</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {goals.map((goal) => (
            <div key={goal.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <goal.icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium">{goal.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">{goal.dueDate}</span>
              </div>
              <div className="space-y-1">
                <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                <div className="flex items-center justify-between text-xs">
                  <span>
                    R$ {goal.current.toLocaleString()} de R$ {goal.target.toLocaleString()}
                  </span>
                  <span>{Math.round((goal.current / goal.target) * 100)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          Adicionar novo objetivo
        </Button>
      </CardFooter>
    </Card>
  )
}

