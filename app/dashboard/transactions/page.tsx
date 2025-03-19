"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowDownLeft, ArrowUpRight, CalendarIcon, CreditCard, Filter, Plus, Search } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

const transactions = [
  {
    id: 1,
    description: "Supermercado Extra",
    amount: -350.75,
    date: "2025-04-05",
    category: "Alimentação",
    account: "Nubank",
    type: "expense",
  },
  {
    id: 2,
    description: "Salário",
    amount: 5000,
    date: "2025-04-05",
    category: "Salário",
    account: "Itaú",
    type: "income",
  },
  {
    id: 3,
    description: "Netflix",
    amount: -39.9,
    date: "2025-04-04",
    category: "Entretenimento",
    account: "Nubank",
    type: "expense",
  },
  {
    id: 4,
    description: "Uber",
    amount: -28.5,
    date: "2025-04-03",
    category: "Transporte",
    account: "Nubank",
    type: "expense",
  },
  {
    id: 5,
    description: "Freelance",
    amount: 800,
    date: "2025-04-02",
    category: "Renda Extra",
    account: "Nubank",
    type: "income",
  },
  {
    id: 6,
    description: "Aluguel",
    amount: -1200,
    date: "2025-04-01",
    category: "Moradia",
    account: "Itaú",
    type: "expense",
  },
]

export default function TransactionsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="md:ml-64">
        <Header />
        <main className="p-4 md:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold">Transações</h1>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar transações..." className="pl-8 w-full sm:w-[250px]" />
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="gap-1 w-full sm:w-auto">
                    <Filter className="h-4 w-4" /> Filtrar
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Filtrar por data</h4>
                      <div className="flex gap-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              <span>Selecionar data</span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar mode="range" locale={ptBR} />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Categoria</h4>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Todas as categorias" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas as categorias</SelectItem>
                          <SelectItem value="food">Alimentação</SelectItem>
                          <SelectItem value="transport">Transporte</SelectItem>
                          <SelectItem value="entertainment">Entretenimento</SelectItem>
                          <SelectItem value="housing">Moradia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Conta</h4>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Todas as contas" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas as contas</SelectItem>
                          <SelectItem value="nubank">Nubank</SelectItem>
                          <SelectItem value="itau">Itaú</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end">
                      <Button>Aplicar filtros</Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-1 w-full sm:w-auto">
                    <Plus className="h-4 w-4" /> Nova transação
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar transação</DialogTitle>
                    <DialogDescription>Registre uma nova transação em sua conta.</DialogDescription>
                  </DialogHeader>
                  <Tabs defaultValue="expense">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="expense">Despesa</TabsTrigger>
                      <TabsTrigger value="income">Receita</TabsTrigger>
                    </TabsList>
                    <TabsContent value="expense" className="space-y-4 pt-4">
                      <div className="grid gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="description">Descrição</Label>
                          <Input id="description" placeholder="Ex: Supermercado" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="amount">Valor</Label>
                          <Input id="amount" type="number" placeholder="0,00" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="date">Data</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="w-full justify-start text-left font-normal">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                <span>Selecionar data</span>
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar locale={ptBR} />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="category">Categoria</Label>
                          <Select>
                            <SelectTrigger id="category">
                              <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="food">Alimentação</SelectItem>
                              <SelectItem value="transport">Transporte</SelectItem>
                              <SelectItem value="entertainment">Entretenimento</SelectItem>
                              <SelectItem value="housing">Moradia</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="account">Conta</Label>
                          <Select>
                            <SelectTrigger id="account">
                              <SelectValue placeholder="Selecione uma conta" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="nubank">Nubank</SelectItem>
                              <SelectItem value="itau">Itaú</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="income" className="space-y-4 pt-4">
                      <div className="grid gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="description-income">Descrição</Label>
                          <Input id="description-income" placeholder="Ex: Salário" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="amount-income">Valor</Label>
                          <Input id="amount-income" type="number" placeholder="0,00" />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="date-income">Data</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="w-full justify-start text-left font-normal">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                <span>Selecionar data</span>
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar locale={ptBR} />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="category-income">Categoria</Label>
                          <Select>
                            <SelectTrigger id="category-income">
                              <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="salary">Salário</SelectItem>
                              <SelectItem value="freelance">Freelance</SelectItem>
                              <SelectItem value="investment">Investimentos</SelectItem>
                              <SelectItem value="other">Outros</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="account-income">Conta</Label>
                          <Select>
                            <SelectTrigger id="account-income">
                              <SelectValue placeholder="Selecione uma conta" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="nubank">Nubank</SelectItem>
                              <SelectItem value="itau">Itaú</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                  <DialogFooter>
                    <Button type="submit">Salvar transação</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Histórico de transações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          transaction.type === "income" ? "bg-green-100" : "bg-red-100"
                        }`}
                      >
                        {transaction.type === "income" ? (
                          <ArrowUpRight className="h-5 w-5 text-green-600" />
                        ) : (
                          <ArrowDownLeft className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{format(new Date(transaction.date), "dd/MM/yyyy")}</span>
                          <span>•</span>
                          <span>{transaction.category}</span>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <CreditCard className="h-3 w-3" />
                            <span>{transaction.account}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className={`font-medium ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                      {transaction.amount > 0 ? "+" : ""}
                      R$ {Math.abs(transaction.amount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}

