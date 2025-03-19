import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Download, LineChart, PieChart } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="md:ml-64">
        <Header />
        <main className="p-4 md:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold">Relatórios</h1>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Select defaultValue="april">
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Selecione um período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="january">Janeiro 2025</SelectItem>
                  <SelectItem value="february">Fevereiro 2025</SelectItem>
                  <SelectItem value="march">Março 2025</SelectItem>
                  <SelectItem value="april">Abril 2025</SelectItem>
                  <SelectItem value="q1">1º Trimestre 2025</SelectItem>
                  <SelectItem value="year">Ano 2025</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="gap-1 w-full sm:w-auto">
                <Download className="h-4 w-4" /> Exportar
              </Button>
            </div>
          </div>

          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Visão geral</TabsTrigger>
              <TabsTrigger value="expenses">Despesas</TabsTrigger>
              <TabsTrigger value="income">Receitas</TabsTrigger>
              <TabsTrigger value="accounts">Contas</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6 space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total de receitas</CardTitle>
                    <CardDescription>Abril 2025</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">R$ 5.800,00</div>
                    <p className="text-xs text-muted-foreground mt-1">+12% em relação ao mês anterior</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total de despesas</CardTitle>
                    <CardDescription>Abril 2025</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">R$ 3.120,80</div>
                    <p className="text-xs text-muted-foreground mt-1">-5% em relação ao mês anterior</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Saldo</CardTitle>
                    <CardDescription>Abril 2025</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">R$ 2.679,20</div>
                    <p className="text-xs text-muted-foreground mt-1">+35% em relação ao mês anterior</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Taxa de economia</CardTitle>
                    <CardDescription>Abril 2025</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">46.2%</div>
                    <p className="text-xs text-muted-foreground mt-1">+8% em relação ao mês anterior</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                      <CardTitle>Receitas vs Despesas</CardTitle>
                      <CardDescription>Comparativo dos últimos 6 meses</CardDescription>
                    </div>
                    <LineChart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <svg width="100%" height="100%" viewBox="0 0 600 300">
                        {/* X and Y axes */}
                        <line x1="50" y1="250" x2="550" y2="250" stroke="currentColor" strokeOpacity="0.2" />
                        <line x1="50" y1="50" x2="50" y2="250" stroke="currentColor" strokeOpacity="0.2" />

                        {/* X-axis labels */}
                        {["Nov", "Dez", "Jan", "Fev", "Mar", "Abr"].map((month, index) => (
                          <text
                            key={`x-label-${index}`}
                            x={50 + (index * 500) / 5}
                            y="270"
                            textAnchor="middle"
                            fontSize="12"
                            fill="currentColor"
                            opacity="0.7"
                          >
                            {month}
                          </text>
                        ))}

                        {/* Y-axis labels */}
                        {[0, 2000, 4000, 6000].map((value, index) => (
                          <text
                            key={`y-label-${index}`}
                            x="40"
                            y={250 - (index * 200) / 3}
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
                          d="M50,150 L133,130 L216,140 L300,120 L383,100 L466,80"
                          fill="none"
                          stroke="#22c55e"
                          strokeWidth="2"
                        />

                        {/* Expense line */}
                        <path
                          d="M50,180 L133,190 L216,170 L300,180 L383,160 L466,170"
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="2"
                        />

                        {/* Data points for income */}
                        {[150, 130, 140, 120, 100, 80].map((point, index) => (
                          <circle
                            key={`income-point-${index}`}
                            cx={50 + (index * 500) / 5}
                            cy={point}
                            r="4"
                            fill="#22c55e"
                          />
                        ))}

                        {/* Data points for expenses */}
                        {[180, 190, 170, 180, 160, 170].map((point, index) => (
                          <circle
                            key={`expense-point-${index}`}
                            cx={50 + (index * 500) / 5}
                            cy={point}
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

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                      <CardTitle>Despesas por categoria</CardTitle>
                      <CardDescription>Abril 2025</CardDescription>
                    </div>
                    <PieChart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex items-center justify-center">
                      <svg width="250" height="250" viewBox="0 0 250 250">
                        {/* Pie chart */}
                        <circle cx="125" cy="125" r="100" fill="none" stroke="#e2e8f0" strokeWidth="40" />

                        {/* Segments */}
                        <circle
                          cx="125"
                          cy="125"
                          r="100"
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="40"
                          strokeDasharray="188.5 439.8"
                          strokeDashoffset="0"
                        />
                        <circle
                          cx="125"
                          cy="125"
                          r="100"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="40"
                          strokeDasharray="125.7 439.8"
                          strokeDashoffset="-188.5"
                        />
                        <circle
                          cx="125"
                          cy="125"
                          r="100"
                          fill="none"
                          stroke="#22c55e"
                          strokeWidth="40"
                          strokeDasharray="62.8 439.8"
                          strokeDashoffset="-314.2"
                        />
                        <circle
                          cx="125"
                          cy="125"
                          r="100"
                          fill="none"
                          stroke="#eab308"
                          strokeWidth="40"
                          strokeDasharray="31.4 439.8"
                          strokeDashoffset="-377"
                        />
                        <circle
                          cx="125"
                          cy="125"
                          r="100"
                          fill="none"
                          stroke="#a855f7"
                          strokeWidth="40"
                          strokeDasharray="31.4 439.8"
                          strokeDashoffset="-408.4"
                        />
                      </svg>

                      <div className="ml-8 space-y-2">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-red-500 mr-2" />
                          <span className="text-sm">Moradia (30%)</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-blue-500 mr-2" />
                          <span className="text-sm">Alimentação (20%)</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-green-500 mr-2" />
                          <span className="text-sm">Transporte (10%)</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2" />
                          <span className="text-sm">Lazer (5%)</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-purple-500 mr-2" />
                          <span className="text-sm">Outros (5%)</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle>Evolução do saldo</CardTitle>
                    <CardDescription>Últimos 12 meses</CardDescription>
                  </div>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <svg width="100%" height="100%" viewBox="0 0 800 300">
                      {/* X and Y axes */}
                      <line x1="50" y1="250" x2="750" y2="250" stroke="currentColor" strokeOpacity="0.2" />
                      <line x1="50" y1="50" x2="50" y2="250" stroke="currentColor" strokeOpacity="0.2" />

                      {/* X-axis labels */}
                      {["Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez", "Jan", "Fev", "Mar", "Abr"].map(
                        (month, index) => (
                          <text
                            key={`x-label-${index}`}
                            x={50 + (index * 700) / 11}
                            y="270"
                            textAnchor="middle"
                            fontSize="12"
                            fill="currentColor"
                            opacity="0.7"
                          >
                            {month}
                          </text>
                        ),
                      )}

                      {/* Y-axis labels */}
                      {[0, 5000, 10000, 15000].map((value, index) => (
                        <text
                          key={`y-label-${index}`}
                          x="40"
                          y={250 - (index * 200) / 3}
                          textAnchor="end"
                          fontSize="12"
                          fill="currentColor"
                          opacity="0.7"
                        >
                          {value}
                        </text>
                      ))}

                      {/* Bars */}
                      {[8000, 8500, 9200, 9800, 10500, 11000, 11300, 11800, 12200, 12500, 12800, 13100].map(
                        (value, index) => (
                          <rect
                            key={`bar-${index}`}
                            x={50 + (index * 700) / 11 - 20}
                            y={250 - (value * 200) / 15000}
                            width="40"
                            height={(value * 200) / 15000}
                            fill="hsl(var(--primary))"
                            opacity="0.8"
                            rx="4"
                          />
                        ),
                      )}
                    </svg>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="expenses" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Análise de despesas</CardTitle>
                  <CardDescription>Detalhamento das suas despesas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">
                      Conteúdo detalhado de análise de despesas será exibido aqui.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="income" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Análise de receitas</CardTitle>
                  <CardDescription>Detalhamento das suas receitas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">
                      Conteúdo detalhado de análise de receitas será exibido aqui.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="accounts" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Análise de contas</CardTitle>
                  <CardDescription>Detalhamento das suas contas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">Conteúdo detalhado de análise de contas será exibido aqui.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

