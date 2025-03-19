import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownRight, ArrowUpRight, DollarSign } from "lucide-react"

export function BalanceCard() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Saldo atual</CardTitle>
        <CardDescription>Todas as contas</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center">
          <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
          <span className="text-2xl font-bold">R$ 12.580,45</span>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="flex items-center text-green-500">
            <ArrowUpRight className="mr-1 h-4 w-4" />
            <span>Receitas: R$ 5.240,00</span>
          </div>
          <div className="flex items-center text-red-500">
            <ArrowDownRight className="mr-1 h-4 w-4" />
            <span>Despesas: R$ 3.120,80</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

