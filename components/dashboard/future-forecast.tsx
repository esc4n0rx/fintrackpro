import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for future forecast
const forecastData = {
  nextMonth: {
    income: 5000,
    expenses: 3800,
    balance: 1200,
    installments: 1500,
  },
  threeMonths: {
    income: 15000,
    expenses: 11000,
    balance: 4000,
    installments: 3800,
  },
  sixMonths: {
    income: 30000,
    expenses: 22000,
    balance: 8000,
    installments: 6500,
  },
}

export function FutureForecast() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Previsão futura</CardTitle>
        <CardDescription>Estimativa da sua situação financeira</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="nextMonth">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="nextMonth">Próximo mês</TabsTrigger>
            <TabsTrigger value="threeMonths">3 meses</TabsTrigger>
            <TabsTrigger value="sixMonths">6 meses</TabsTrigger>
          </TabsList>

          {Object.entries(forecastData).map(([period, data]) => (
            <TabsContent key={period} value={period} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Receitas previstas</p>
                  <p className="text-xl font-bold text-green-500">R$ {data.income.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Despesas previstas</p>
                  <p className="text-xl font-bold text-red-500">R$ {data.expenses.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Saldo previsto</p>
                  <p className="text-xl font-bold">R$ {data.balance.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Parcelas futuras</p>
                  <p className="text-xl font-bold">R$ {data.installments.toLocaleString()}</p>
                </div>
              </div>

              <div className="rounded-lg bg-muted p-4">
                <h4 className="font-medium">Recomendação</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {data.balance > 0
                    ? "Sua situação financeira está saudável. Considere investir o saldo excedente."
                    : "Atenção! Você pode ter dificuldades financeiras. Considere reduzir gastos não essenciais."}
                </p>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}

