"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Car, Home, Plane, Plus, ShoppingBag, BookOpen } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { toast } from "react-hot-toast"

// Mapeamento de string para ícone (usado na listagem de goals)
const iconMapping = {
  travel: Plane,
  car: Car,
  home: Home,
  shopping: ShoppingBag,
  education: BookOpen,
}

export default function GoalsPage() {
  // Estado para armazenar a lista de goals (retornados da API)
  const [goals, setGoals] = useState<any[]>([])
  // Estados para os campos do formulário de criação
  const [goalName, setGoalName] = useState("")
  const [goalDescription, setGoalDescription] = useState("")
  const [goalTarget, setGoalTarget] = useState(0)
  const [goalCurrent, setGoalCurrent] = useState(0)
  const [goalDueDate, setGoalDueDate] = useState<Date | null>(null)
  const [goalIcon, setGoalIcon] = useState("")
  const [goalColor, setGoalColor] = useState("")
  const [userId, setUserId] = useState<string | null>(null); 
  const [open, setOpen] = useState(false)

  const [openAddValue, setOpenAddValue] = useState(false)
  const [selectedGoalId, setSelectedGoalId] = useState("")
  const [addAmount, setAddAmount] = useState(0)

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    setUserId(userId);
  }, []);

  const fetchGoals = async () => {
    if (userId) {
      try {
        const res = await fetch(`/api/goals?user_id=${userId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        })
        const data = await res.json()
        const formatted = data.goals.map((goal: any) => ({
          ...goal,
          dueDate: goal.due_date ?? null,
          current: goal.current ?? 0
        }))
        setGoals(formatted)
      } catch (err) {
        console.error("Erro ao buscar goals:", err)
        toast.error("Erro ao buscar objetivos.")
      }
    }
  }

  // Busca os goals ao carregar a página
  useEffect(() => {
    fetchGoals()
  }, [userId])

  // Mapeamento opcional de cor padrão conforme o ícone escolhido
  const defaultColorByIcon = (icon: string) => {
    switch (icon) {
      case "travel":
        return "bg-blue-500"
      case "car":
        return "bg-orange-500"
      case "home":
        return "bg-green-500"
      case "shopping":
        return "bg-purple-500"
      case "education":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  // Função para criar um novo goal
  const handleCreateGoal = async () => {
    if (!userId || !goalName || !goalTarget) {
      toast.error("Preencha os campos obrigatórios.")
      return
    }
    // Se o usuário não definir uma cor, usa a cor padrão baseada no ícone
    const color = goalColor || defaultColorByIcon(goalIcon)
    // Converte a data para formato YYYY-MM-DD se estiver definida
    const dueDateString = goalDueDate ? goalDueDate.toISOString().split("T")[0] : null

    const newGoal = {
      user_id: userId,
      name: goalName,
      description: goalDescription,
      target: goalTarget,
      current: goalCurrent, // geralmente zero
      dueDate: dueDateString,
      icon: goalIcon, // será armazenado como string
      color
    }

    const res = await fetch("/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newGoal)
    })
    const data = await res.json()
    if (!res.ok) {
      toast.error("Erro ao criar objetivo: " + data.error)
    } else {
      toast.success("Objetivo criado com sucesso")
      // Atualiza a lista de goals com o novo objetivo, usando fallback para dueDate
      setGoals((prev) => [
        ...prev,
        { ...data.goal ?? {}, dueDate: data.goal?.due_date ?? null }
      ])
      // Reseta os campos do formulário
      setGoalName("")
      setGoalDescription("")
      setGoalTarget(0)
      setGoalCurrent(0)
      setGoalDueDate(null)
      setGoalIcon("")
      setGoalColor("")
      // Fecha o modal
      setOpen(false)
    }
  }

  // Função para adicionar valor a um objetivo
  const handleAddValue = async () => {
    if (!selectedGoalId || addAmount <= 0) {
      toast.error("Informe um valor válido.")
      return
    }

    const res = await fetch("/api/goals/add", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goal_id: selectedGoalId, addAmount })
    })

    const data = await res.json()
    if (!res.ok) {
      toast.error("Erro ao adicionar valor: " + data.error)
    } else {
      toast.success("Valor adicionado com sucesso")
      // Se a API não retornar o goal atualizado, refaz a busca
      if (!data.goal || data.goal.current == null) {
        await fetchGoals()
      } else {
        setGoals((prevGoals) =>
          prevGoals.map((goal) =>
            goal.id === selectedGoalId
              ? { ...goal, current: data.goal.current }
              : goal
          )
        )
      }
      setOpenAddValue(false)
      setAddAmount(0)
      setSelectedGoalId("")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="md:ml-64">
        <Header />
        <main className="p-4 md:p-6 space-y-6">
          {/* Cabeçalho e modal para criação de novo goal */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Objetivos financeiros</h1>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="gap-1" onClick={() => setOpen(true)}>
                  <Plus className="h-4 w-4" /> Novo objetivo
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar novo objetivo</DialogTitle>
                  <DialogDescription>
                    Defina uma meta financeira para acompanhar seu progresso.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="goal-name">Nome do objetivo</Label>
                    <Input
                      id="goal-name"
                      placeholder="Ex: Viagem, Carro, etc."
                      value={goalName}
                      onChange={(e) => setGoalName(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="goal-description">Descrição</Label>
                    <Input
                      id="goal-description"
                      placeholder="Descreva seu objetivo"
                      value={goalDescription}
                      onChange={(e) => setGoalDescription(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="goal-amount">Valor total</Label>
                    <Input
                      id="goal-amount"
                      type="number"
                      placeholder="0,00"
                      value={goalTarget}
                      onChange={(e) => setGoalTarget(Number(e.target.value))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="goal-initial">Valor inicial (opcional)</Label>
                    <Input
                      id="goal-initial"
                      type="number"
                      placeholder="0,00"
                      value={goalCurrent}
                      onChange={(e) => setGoalCurrent(Number(e.target.value))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="goal-date">Data limite</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          <span>{goalDueDate ? goalDueDate.toLocaleDateString() : "Selecionar data"}</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={goalDueDate || undefined}
                          onSelect={(day) => setGoalDueDate(day || null)}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="goal-icon">Ícone</Label>
                    <Select value={goalIcon} onValueChange={(value) => setGoalIcon(value)}>
                      <SelectTrigger id="goal-icon">
                        <SelectValue placeholder="Selecione um ícone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="travel">Viagem</SelectItem>
                        <SelectItem value="car">Carro</SelectItem>
                        <SelectItem value="home">Casa</SelectItem>
                        <SelectItem value="shopping">Compras</SelectItem>
                        <SelectItem value="education">Educação</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" onClick={handleCreateGoal}>
                    Criar objetivo
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
  
          {/* Listagem de goals */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {goals.map((goal: { id: string; name: string; description: string; target: number; current: number; dueDate: string; icon: keyof typeof iconMapping; color: string }) => {
              const IconComponent = iconMapping[goal.icon] || Plane
              return (
                <Card key={goal.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`h-10 w-10 rounded-full ${goal.color || defaultColorByIcon(goal.icon)} flex items-center justify-center`}>
                          <IconComponent className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <CardTitle>{goal.name}</CardTitle>
                          <CardDescription>{goal.description}</CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Progresso</span>
                        <span className="text-sm font-medium">
                          {Math.round((goal.current / goal.target) * 100)}%
                        </span>
                      </div>
                      <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                      <div className="flex justify-between text-sm">
                        <span>
                          R$ {Number(goal.current).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-muted-foreground">
                          Meta: R$ {Number(goal.target).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <div>
                        <p className="text-muted-foreground">Data limite</p>
                        <p className="font-medium">{goal.dueDate || "-"}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-muted-foreground">Faltam</p>
                        <p className="font-medium">
                          R$ {Number(goal.target - goal.current).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">Editar</Button>
                    <Button size="sm" onClick={() => {
                      setSelectedGoalId(goal.id)
                      setOpenAddValue(true)
                    }}>
                      Adicionar valor
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
  
          {/* Modal para adicionar valor a um objetivo */}
          <Dialog open={openAddValue} onOpenChange={setOpenAddValue}>
            <DialogTrigger asChild></DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar valor</DialogTitle>
                <DialogDescription>
                  Informe o valor que deseja adicionar a este objetivo.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Label htmlFor="add-value">Valor a adicionar</Label>
                <Input
                  id="add-value"
                  type="number"
                  value={addAmount}
                  onChange={(e) => setAddAmount(Number(e.target.value))}
                  placeholder="0,00"
                />
              </div>
              <DialogFooter>
                <Button onClick={handleAddValue}>Confirmar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
  
        </main>
      </div>
    </div>
  )
}
