"use client" 

import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
import { BanknoteIcon as Bank, CreditCard, Wallet, Plus } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { toast } from "react-hot-toast"

export default function AccountsPage() {
  const [hostAccounts, setHostAccounts] = useState<any>(null)
  const [partnerAccounts, setPartnerAccounts] = useState<any>(null)
  
  const [accountType, setAccountType] = useState('')
  const [name, setName] = useState('')
  const [balance, setBalance] = useState(0)
  const [limit, setLimit] = useState(0)
  const [dueDate, setDueDate] = useState(0)
  
  // Estado para controlar a abertura do modal
  const [open, setOpen] = useState(false)
  
  const userId = localStorage.getItem("user_id")
  
  useEffect(() => {
    if (userId) {
      fetch(`/api/accounts?user_id=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(data => {
          setHostAccounts(data.host)
          setPartnerAccounts(data.partner)
        })
        .catch(error => console.error('Error fetching accounts:', error))
    }
  }, [userId])
  
  const handleAddAccount = async () => {
    const accountData = {
      user_id: userId,
      accountType,
      name,
      balance,
      limit,
      dueDate,
    }
  
    const res = await fetch('/api/accounts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(accountData),
    })
  
    const data = await res.json()
    if (!res.ok) {
      toast.error('Erro ao adicionar conta: ' + data.error)
    } else {
      toast.success('Conta adicionada com sucesso')
      // Atualiza os dados conforme o tipo de conta
      if (accountType === "bank") {
        setHostAccounts((prev: any) => ({
          ...prev,
          bankAccounts: [...(prev?.bankAccounts || []), data.data]
        }))
      } else if (accountType === "credit") {
        setHostAccounts((prev: any) => ({
          ...prev,
          creditCards: [...(prev?.creditCards || []), data.data]
        }))
      } else if (accountType === "wallet") {
        setHostAccounts((prev: any) => ({
          ...prev,
          wallets: [...(prev?.wallets || []), data.data]
        }))
      }
      // Opcional: reseta os campos do formulário
      setAccountType('')
      setName('')
      setBalance(0)
      setLimit(0)
      setDueDate(0)
      // Fecha o modal
      setOpen(false)
    }
  }
  
  // Função auxiliar para retornar o ícone e a cor padrão com base no tipo de conta
  const getAccountDisplayProps = (type: string, account: any) => {
    // Se account for nulo ou indefinido, utiliza um objeto vazio
    const safeAccount = account || {};
  
    if (type === 'bank') {
      return {
        icon: safeAccount.icon || Bank,
        color: safeAccount.color || "bg-blue-500",
        description: safeAccount.type || "Conta bancária"
      }
    }
    if (type === 'credit') {
      return {
        icon: safeAccount.icon || CreditCard,
        color: safeAccount.color || "bg-green-500",
        description: safeAccount.dueDate ? `Vence dia ${safeAccount.dueDate}` : "Cartão de crédito"
      }
    }
    if (type === 'wallet') {
      return {
        icon: safeAccount.icon || Wallet,
        color: safeAccount.color || "bg-yellow-500",
        description: safeAccount.type || "Carteira pessoal"
      }
    }
    return { icon: Bank, color: "bg-gray-500", description: "" }
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="md:ml-64">
        <Header />
        <main className="p-4 md:p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Contas</h1>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="gap-1" onClick={() => setOpen(true)}>
                  <Plus className="h-4 w-4" /> Nova conta
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar nova conta</DialogTitle>
                  <DialogDescription>
                    Preencha os detalhes da sua nova conta financeira.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="account-type">Tipo de conta</Label>
                    <Select value={accountType} onValueChange={(value) => setAccountType(value)}>
                      <SelectTrigger id="account-type">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bank">Conta bancária</SelectItem>
                        <SelectItem value="credit">Cartão de crédito</SelectItem>
                        <SelectItem value="wallet">Carteira</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Nubank, Itaú, etc." />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="balance">Saldo inicial</Label>
                    <Input id="balance" type="number" value={balance} onChange={(e) => setBalance(Number(e.target.value))} placeholder="0,00" />
                  </div>
                  {accountType === 'credit' && (
                    <>
                      <div className="grid gap-2">
                        <Label htmlFor="limit">Limite do cartão</Label>
                        <Input id="limit" type="number" value={limit} onChange={(e) => setLimit(Number(e.target.value))} placeholder="Limite total" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="dueDate">Data de vencimento</Label>
                        <Input id="dueDate" type="number" value={dueDate} onChange={(e) => setDueDate(Number(e.target.value))} placeholder="Dia de vencimento" />
                      </div>
                    </>
                  )}
                </div>
                <DialogFooter>
                  <Button type="button" onClick={handleAddAccount}>
                    Adicionar conta
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
  
          <Tabs defaultValue="bank">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="bank">Contas bancárias</TabsTrigger>
              <TabsTrigger value="credit">Cartões de crédito</TabsTrigger>
              <TabsTrigger value="wallet">Carteiras</TabsTrigger>
            </TabsList>
  
            {/* Contas Bancárias */}
            <TabsContent value="bank" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {hostAccounts?.bankAccounts?.filter(Boolean).map((account: any) => {
                  const { icon: Icon, color, description } = getAccountDisplayProps("bank", account)
                  return (
                    <Card key={account.id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`h-8 w-8 rounded-full ${color} flex items-center justify-center`}>
                              <Icon className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <CardTitle>{account.name}</CardTitle>
                              <CardDescription>{description}</CardDescription>
                              <div className="text-sm text-muted-foreground">
                                Responsável: {account.responsavel}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          R$ {account.balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" size="sm">Editar</Button>
                        <Button variant="outline" size="sm">Transações</Button>
                      </CardFooter>
                    </Card>
                  )
                })}
                {partnerAccounts?.bankAccounts?.filter(Boolean).map((account: any) => {
                  const { icon: Icon, color, description } = getAccountDisplayProps("bank", account)
                  return (
                    <Card key={account.id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`h-8 w-8 rounded-full ${color} flex items-center justify-center`}>
                              <Icon className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <CardTitle>{account.name}</CardTitle>
                              <CardDescription>{description}</CardDescription>
                              <div className="text-sm text-muted-foreground">
                                Responsável: {account.responsavel}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          R$ {account.balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" size="sm">Editar</Button>
                        <Button variant="outline" size="sm">Transações</Button>
                      </CardFooter>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>
  
            {/* Cartões de Crédito */}
            <TabsContent value="credit" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {hostAccounts?.creditCards?.filter(Boolean).map((card: any) => {
                  const { icon: Icon, color, description } = getAccountDisplayProps("credit", card)
                  return (
                    <Card key={card.id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`h-8 w-8 rounded-full ${color} flex items-center justify-center`}>
                              <Icon className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <CardTitle>{card.name}</CardTitle>
                              <CardDescription>{description}</CardDescription>
                              <div className="text-sm text-muted-foreground">
                                Responsável: {card.responsavel}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-2xl font-bold">
                          R$ {card.used.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Limite utilizado</span>
                            <span>{Math.round((card.used / card.limit) * 100)}%</span>
                          </div>
                          <Progress value={(card.used / card.limit) * 100} className="h-2" />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>R$ {card.used.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                            <span>R$ {card.limit.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" size="sm">Editar</Button>
                        <Button variant="outline" size="sm">Fatura</Button>
                      </CardFooter>
                    </Card>
                  )
                })}
                {partnerAccounts?.creditCards?.filter(Boolean).map((card: any) => {
                  const { icon: Icon, color, description } = getAccountDisplayProps("credit", card)
                  return (
                    <Card key={card.id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`h-8 w-8 rounded-full ${color} flex items-center justify-center`}>
                              <Icon className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <CardTitle>{card.name}</CardTitle>
                              <CardDescription>{description}</CardDescription>
                              <div className="text-sm text-muted-foreground">
                                Responsável: {card.responsavel}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="text-2xl font-bold">
                          R$ {card.used.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Limite utilizado</span>
                            <span>{Math.round((card.used / card.limit) * 100)}%</span>
                          </div>
                          <Progress value={(card.used / card.limit) * 100} className="h-2" />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>R$ {card.used.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                            <span>R$ {card.limit.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" size="sm">Editar</Button>
                        <Button variant="outline" size="sm">Fatura</Button>
                      </CardFooter>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>
  
            {/* Carteiras */}
            <TabsContent value="wallet" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {hostAccounts?.wallets?.filter(Boolean).map((wallet: any) => {
                  const { icon: Icon, color, description } = getAccountDisplayProps("wallet", wallet)
                  return (
                    <Card key={wallet.id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`h-8 w-8 rounded-full ${color} flex items-center justify-center`}>
                              <Icon className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <CardTitle>{wallet.name}</CardTitle>
                              <CardDescription>{description}</CardDescription>
                              <div className="text-sm text-muted-foreground">
                                Responsável: {wallet.responsavel}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          R$ {wallet.balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" size="sm">Editar</Button>
                        <Button variant="outline" size="sm">Transações</Button>
                      </CardFooter>
                    </Card>
                  )
                })}
                {partnerAccounts?.wallets?.filter(Boolean).map((wallet: any) => {
                  const { icon: Icon, color, description } = getAccountDisplayProps("wallet", wallet)
                  return (
                    <Card key={wallet.id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`h-8 w-8 rounded-full ${color} flex items-center justify-center`}>
                              <Icon className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <CardTitle>{wallet.name}</CardTitle>
                              <CardDescription>{description}</CardDescription>
                              <div className="text-sm text-muted-foreground">
                                Responsável: {wallet.responsavel}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          R$ {wallet.balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" size="sm">Editar</Button>
                        <Button variant="outline" size="sm">Transações</Button>
                      </CardFooter>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
