"use client"

import { useState, useEffect } from "react"
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
import { toast } from "react-hot-toast"

// Estado para armazenar as transações
export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState(0)
  const [date, setDate] = useState<string>("")
  const [category, setCategory] = useState("")
  const [account, setAccount] = useState("")
  const [type, setType] = useState("expense") 
  const [isRecurring, setIsRecurring] = useState(false)
  const [open, setOpen] = useState(false)
  const [userId, setUserId] = useState<string | null>(null); 

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    setUserId(userId);
  }, []);

  // Buscar transações ao carregar a página
  useEffect(() => {
    if (userId) {
      fetch(`/api/transactions?user_id=${userId}`)
        .then((res) => res.json())
        .then((data) => setTransactions(data.transactions))
        .catch((err) => toast.error("Erro ao carregar transações"))
    }
  }, [userId])

  // Função para adicionar transação
  const handleAddTransaction = async () => {
    if (!userId || !description || amount === 0 || !category || !account || !date) {
      toast.error("Preencha todos os campos.")
      return
    }

    const newTransaction = {
      user_id: userId,
      description,
      amount,
      date,
      category,
      account,
      type,
      is_recurring: isRecurring,
    }

    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTransaction),
    })

    const data = await res.json()

    if (res.ok) {
      toast.success("Transação adicionada com sucesso!")
      setTransactions((prev) => [data.transaction, ...prev]) // Adiciona a transação à lista
      setOpen(false) // Fecha o modal
      resetForm() // Reseta os campos do formulário
    } else {
      toast.error("Erro ao adicionar transação: " + data.error)
    }
  }

  // Função para resetar os campos do formulário
  const resetForm = () => {
    setDescription("")
    setAmount(0)
    setDate("")
    setCategory("")
    setAccount("")
    setType("expense")
    setIsRecurring(false)
  }

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
              <Dialog open={open} onOpenChange={setOpen}>
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
                          <Input
                            id="description"
                            placeholder="Ex: Supermercado"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="amount">Valor</Label>
                          <Input
                            id="amount"
                            type="number"
                            placeholder="0,00"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                          />
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
                              <Calendar locale={ptBR} onSelect={(date: Date | undefined) => setDate(date?.toISOString().split("T")[0] || "")} />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="category">Categoria</Label>
                          <Select
                            value={category}
                            onValueChange={setCategory}
                          >
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
                          <Select
                            value={account}
                            onValueChange={setAccount}
                          >
                            <SelectTrigger id="account">
                              <SelectValue placeholder="Selecione uma conta" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="nubank">Nubank</SelectItem>
                              <SelectItem value="itau">Itaú</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="recurring">Transação Recorrente</Label>
                          <Input
                            id="recurring"
                            type="checkbox"
                            checked={isRecurring}
                            onChange={(e) => setIsRecurring(e.target.checked)}
                          />
                        </div>
                      </div>
                    </TabsContent>
                    <DialogFooter>
                      <Button type="button" onClick={handleAddTransaction}>
                        Salvar transação
                      </Button>
                    </DialogFooter>
                  </Tabs>
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
