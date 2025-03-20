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

export default function TransactionsPage() {
  // Estados para transações e campos do formulário
  const [transactions, setTransactions] = useState<any[]>([])
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState(0)
  const [date, setDate] = useState<string>("")
  const [category, setCategory] = useState("")
  // "account" armazenará o ID da conta selecionada
  const [account, setAccount] = useState("")
  const [type, setType] = useState("expense") // "expense" ou "income"
  const [isRecurring, setIsRecurring] = useState(false)
  const [open, setOpen] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  // Estado para armazenar as contas do usuário (contas bancárias e cartões)
  const [userAccounts, setUserAccounts] = useState<any[]>([])

  // Buscar o user_id do localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id")
    console.log("User ID recuperado:", storedUserId)
    setUserId(storedUserId)
  }, [])

  // Buscar transações ao carregar a página (ou quando userId mudar)
  useEffect(() => {
    if (userId) {
      fetch(`/api/transactions?user_id=${userId}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Transações recebidas:", data.transactions)
          setTransactions(data.transactions || [])
        })
        .catch((err) => {
          console.error("Erro ao carregar transações", err)
          toast.error("Erro ao carregar transações")
        })
    }
  }, [userId])

  // Buscar as contas registradas do usuário
  useEffect(() => {
    if (userId) {
      fetch(`/api/accounts?user_id=${userId}`)
        .then((res) => res.json())
        .then((data) => {
          const hostAccounts = data.host || {}
          // Combina contas bancárias e cartões (adicione wallets se desejar)
          const combined = [
            ...(hostAccounts.bankAccounts || []),
            ...(hostAccounts.creditCards || [])
          ]
          console.log("Contas do usuário:", combined)
          setUserAccounts(combined)
        })
        .catch((err) => {
          console.error("Erro ao carregar contas", err)
          toast.error("Erro ao carregar suas contas")
        })
    }
  }, [userId])

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

  // Função para adicionar uma nova transação
  const handleAddTransaction = async () => {
    if (!userId || !description || amount === 0 || !category || !account || !date) {
      toast.error("Preencha todos os campos.")
      return
    }

    // Cria o objeto de transação – "account" agora é o ID da conta selecionada
    const newTransaction = {
      user_id: userId,
      description,
      amount,
      date,
      category,
      account, // enviando o ID da conta
      type,
      is_recurring: isRecurring,
    }

    console.log("Enviando nova transação:", newTransaction)

    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTransaction),
    })

    const data = await res.json()

    if (res.ok) {
      toast.success("Transação adicionada com sucesso!")
      console.log("Transação adicionada:", data.transaction)
      setTransactions((prev) => [data.transaction, ...prev])
      setOpen(false)
      resetForm()
    } else {
      console.error("Erro ao adicionar transação:", data.error)
      toast.error("Erro ao adicionar transação: " + data.error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="md:ml-64">
        <Header />
        <main className="p-4 md:p-6 space-y-6">
          {/* Cabeçalho, filtros e botão para nova transação */}
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
                          {userAccounts.map((acc: any) => (
                            <SelectItem key={acc.id} value={acc.id}>
                              {acc.name} {acc.type ? `(${acc.type})` : ""}
                            </SelectItem>
                          ))}
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
                  <Tabs defaultValue="expense" onValueChange={(val) => {
                    setType(val)
                    console.log("Tipo selecionado:", val)
                  }}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="expense">Despesa</TabsTrigger>
                      <TabsTrigger value="income">Receita</TabsTrigger>
                    </TabsList>
                    {/* Aba para Despesa */}
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
                                <span>{date ? format(new Date(date), "dd/MM/yyyy") : "Selecionar data"}</span>
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                locale={ptBR}
                                selected={date ? new Date(date) : undefined}
                                onSelect={(selectedDate: Date | undefined) => {
                                  const newDate = selectedDate ? selectedDate.toISOString().split("T")[0] : ""
                                  console.log("Data selecionada:", newDate)
                                  setDate(newDate)
                                }}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="category">Categoria</Label>
                          <Select value={category} onValueChange={setCategory}>
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
                          <Select value={account} onValueChange={setAccount}>
                            <SelectTrigger id="account">
                              <SelectValue placeholder="Selecione uma conta" />
                            </SelectTrigger>
                            <SelectContent>
                              {userAccounts.map((acc: any) => (
                                <SelectItem key={acc.id} value={acc.id}>
                                  {acc.name} {acc.type ? `(${acc.type})` : ""}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="recurring">Transação Recorrente</Label>
                          <Input
                            id="recurring"
                            type="checkbox"
                            checked={isRecurring}
                            onChange={(e) => {
                              console.log("Transação recorrente:", e.target.checked)
                              setIsRecurring(e.target.checked)
                            }}
                          />
                        </div>
                      </div>
                    </TabsContent>
                    {/* Aba para Receita */}
                    <TabsContent value="income" className="space-y-4 pt-4">
                      <div className="grid gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="description-income">Descrição</Label>
                          <Input
                            id="description-income"
                            placeholder="Ex: Salário"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="amount-income">Valor</Label>
                          <Input
                            id="amount-income"
                            type="number"
                            placeholder="0,00"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="date-income">Data</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="w-full justify-start text-left font-normal">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                <span>{date ? format(new Date(date), "dd/MM/yyyy") : "Selecionar data"}</span>
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                locale={ptBR}
                                selected={date ? new Date(date) : undefined}
                                onSelect={(selectedDate: Date | undefined) => {
                                  const newDate = selectedDate ? selectedDate.toISOString().split("T")[0] : ""
                                  console.log("Data selecionada:", newDate)
                                  setDate(newDate)
                                }}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="category-income">Categoria</Label>
                          <Select value={category} onValueChange={setCategory}>
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
                          <Select value={account} onValueChange={setAccount}>
                            <SelectTrigger id="account-income">
                              <SelectValue placeholder="Selecione uma conta" />
                            </SelectTrigger>
                            <SelectContent>
                              {userAccounts.map((acc: any) => (
                                <SelectItem key={acc.id} value={acc.id}>
                                  {acc.name} {acc.type ? `(${acc.type})` : ""}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                  <DialogFooter>
                    <Button type="button" onClick={handleAddTransaction}>
                      Salvar transação
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Histórico de transações */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Histórico de transações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions
                  ?.filter((t) => t != null)
                  .map((transaction) => {
                    // Se transaction.type não existir, assumimos "expense"
                    const txType = transaction.type || "expense"
                    return (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full ${
                              txType === "income" ? "bg-green-100" : "bg-red-100"
                            }`}
                          >
                            {txType === "income" ? (
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
                        <p className={`font-medium ${txType === "income" ? "text-green-600" : "text-red-600"}`}>
                          {txType === "income" ? "+" : "-"} R$ {Math.abs(transaction.amount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
