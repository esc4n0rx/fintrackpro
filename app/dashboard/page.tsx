"use client"

import { BalanceCard } from "@/components/dashboard/balance-card"
import { ExpenseCategories } from "@/components/dashboard/expense-categories"
import { FinancialGoals } from "@/components/dashboard/financial-goals"
import { FutureForecast } from "@/components/dashboard/future-forecast"
import { Header } from "@/components/dashboard/header"
import { OverviewChart } from "@/components/dashboard/overview-chart"
import { Sidebar } from "@/components/dashboard/sidebar"
import { UpcomingExpenses } from "@/components/dashboard/upcoming-expenses"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="md:ml-64">
        <Header />
        <main className="p-4 md:p-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <BalanceCard />
            <Card className="col-span-1 md:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Contas</CardTitle>
                <CardDescription>Suas contas bancárias</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <CreditCard className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Nubank</p>
                        <p className="text-xs text-muted-foreground">Conta corrente</p>
                      </div>
                    </div>
                    <p className="font-medium">R$ 5.240,80</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                        <CreditCard className="h-4 w-4 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Itaú</p>
                        <p className="text-xs text-muted-foreground">Conta poupança</p>
                      </div>
                    </div>
                    <p className="font-medium">R$ 7.339,65</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-1 md:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Cartões</CardTitle>
                <CardDescription>Seus cartões de crédito</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <CreditCard className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Nubank</p>
                        <p className="text-xs text-muted-foreground">Vence dia 10</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">R$ 850,75</p>
                      <p className="text-xs text-muted-foreground">Limite: R$ 5.000</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <CreditCard className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Itaú</p>
                        <p className="text-xs text-muted-foreground">Vence dia 15</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">R$ 1.240,30</p>
                      <p className="text-xs text-muted-foreground">Limite: R$ 8.000</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-1 md:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Resumo do mês</CardTitle>
                <CardDescription>Abril 2025</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Orçamento total</span>
                      <span className="font-medium">R$ 4.000,00</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Gasto até agora</span>
                      <span className="font-medium">R$ 3.120,80</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Restante</span>
                      <span className="font-medium text-green-500">R$ 879,20</span>
                    </div>
                  </div>
                  <Progress value={78} className="h-2" />
                  <p className="text-xs text-center text-muted-foreground">78% do orçamento utilizado</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="col-span-full lg:col-span-2">
              <OverviewChart />
            </div>
            <div className="md:col-span-1">
              <ExpenseCategories />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="md:col-span-1">
              <UpcomingExpenses />
            </div>
            <div className="md:col-span-1">
              <FinancialGoals />
            </div>
            <div className="md:col-span-2 lg:col-span-1">
              <FutureForecast />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CreditCard } from "lucide-react"

