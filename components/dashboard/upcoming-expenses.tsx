import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, CreditCard, Home, ShoppingBag } from "lucide-react"

// Mock data for upcoming expenses
const upcomingExpenses = [
  {
    id: 1,
    name: "Aluguel",
    amount: 1200,
    dueDate: "15/04/2025",
    icon: Home,
    status: "pending",
  },
  {
    id: 2,
    name: "Cartão de crédito",
    amount: 850.75,
    dueDate: "10/04/2025",
    icon: CreditCard,
    status: "pending",
  },
  {
    id: 3,
    name: "Parcela TV",
    amount: 299.9,
    dueDate: "20/04/2025",
    icon: ShoppingBag,
    status: "pending",
  },
]

export function UpcomingExpenses() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Próximas despesas</CardTitle>
        <CardDescription>Contas a pagar nos próximos dias</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingExpenses.map((expense) => (
            <div key={expense.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <expense.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{expense.name}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Vencimento: {expense.dueDate}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">R$ {expense.amount.toFixed(2).replace(".", ",")}</p>
                <span className="text-xs text-muted-foreground">
                  {expense.status === "pending" ? "Pendente" : "Pago"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          Ver todas as despesas
        </Button>
      </CardFooter>
    </Card>
  )
}

