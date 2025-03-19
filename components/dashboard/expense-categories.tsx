import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

// Mock data for expense categories
const categories = [
  { name: "Alimentação", amount: 850, budget: 1000, color: "bg-red-500" },
  { name: "Moradia", amount: 1200, budget: 1500, color: "bg-blue-500" },
  { name: "Transporte", amount: 450, budget: 600, color: "bg-green-500" },
  { name: "Lazer", amount: 320, budget: 400, color: "bg-yellow-500" },
  { name: "Saúde", amount: 200, budget: 500, color: "bg-purple-500" },
]

export function ExpenseCategories() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Categorias de despesas</CardTitle>
        <CardDescription>Gastos por categoria neste mês</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category.name} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>{category.name}</span>
                <span>
                  R$ {category.amount.toLocaleString()} / R$ {category.budget.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Progress
                  value={(category.amount / category.budget) * 100}
                  className="h-2"
                  indicatorClassName={category.color}
                />
                <span className="text-xs text-muted-foreground">
                  {Math.round((category.amount / category.budget) * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

