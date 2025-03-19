import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="md:ml-64">
        <Header />
        <main className="p-4 md:p-6 space-y-6">
          <h1 className="text-2xl font-bold">Configurações</h1>

          <Tabs defaultValue="profile">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Perfil</TabsTrigger>
              <TabsTrigger value="notifications">Notificações</TabsTrigger>
              <TabsTrigger value="preferences">Preferências</TabsTrigger>
              <TabsTrigger value="security">Segurança</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações pessoais</CardTitle>
                  <CardDescription>Atualize suas informações pessoais.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome</Label>
                      <Input id="name" defaultValue="João Silva" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" defaultValue="test@gmail.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input id="phone" defaultValue="(11) 98765-4321" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="birth-date">Data de nascimento</Label>
                      <Input id="birth-date" defaultValue="15/05/1985" />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button>Salvar alterações</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Gerenciar parceiros</CardTitle>
                  <CardDescription>Gerencie quem tem acesso ao seu controle financeiro.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Maria Silva</p>
                      <p className="text-sm text-muted-foreground">maria@gmail.com</p>
                    </div>
                    <Button variant="destructive">Remover</Button>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-partner">Adicionar novo parceiro</Label>
                    <div className="flex gap-2">
                      <Input id="new-partner" placeholder="Email do parceiro" />
                      <Button>Convidar</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notificações</CardTitle>
                  <CardDescription>Configure como deseja receber notificações.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notify-bills">Contas a vencer</Label>
                        <p className="text-sm text-muted-foreground">
                          Receba notificações quando uma conta estiver próxima do vencimento.
                        </p>
                      </div>
                      <Switch id="notify-bills" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notify-budget">Orçamento</Label>
                        <p className="text-sm text-muted-foreground">
                          Receba notificações quando atingir 80% do orçamento de uma categoria.
                        </p>
                      </div>
                      <Switch id="notify-budget" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notify-goals">Objetivos</Label>
                        <p className="text-sm text-muted-foreground">
                          Receba notificações sobre o progresso dos seus objetivos financeiros.
                        </p>
                      </div>
                      <Switch id="notify-goals" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notify-tips">Dicas financeiras</Label>
                        <p className="text-sm text-muted-foreground">
                          Receba dicas e sugestões para melhorar suas finanças.
                        </p>
                      </div>
                      <Switch id="notify-tips" defaultChecked />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button>Salvar preferências</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Preferências</CardTitle>
                  <CardDescription>Personalize sua experiência no aplicativo.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currency">Moeda</Label>
                      <Select defaultValue="brl">
                        <SelectTrigger id="currency">
                          <SelectValue placeholder="Selecione uma moeda" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="brl">Real Brasileiro (R$)</SelectItem>
                          <SelectItem value="usd">Dólar Americano ($)</SelectItem>
                          <SelectItem value="eur">Euro (€)</SelectItem>
                          <SelectItem value="gbp">Libra Esterlina (£)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date-format">Formato de data</Label>
                      <Select defaultValue="dd-mm-yyyy">
                        <SelectTrigger id="date-format">
                          <SelectValue placeholder="Selecione um formato" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dd-mm-yyyy">DD/MM/AAAA</SelectItem>
                          <SelectItem value="mm-dd-yyyy">MM/DD/AAAA</SelectItem>
                          <SelectItem value="yyyy-mm-dd">AAAA/MM/DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="theme">Tema</Label>
                      <Select defaultValue="system">
                        <SelectTrigger id="theme">
                          <SelectValue placeholder="Selecione um tema" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Claro</SelectItem>
                          <SelectItem value="dark">Escuro</SelectItem>
                          <SelectItem value="system">Sistema</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="start-page">Página inicial</Label>
                        <p className="text-sm text-muted-foreground">
                          Escolha qual página será exibida ao abrir o aplicativo.
                        </p>
                      </div>
                      <Select defaultValue="dashboard">
                        <SelectTrigger id="start-page" className="w-[180px]">
                          <SelectValue placeholder="Selecione uma página" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dashboard">Dashboard</SelectItem>
                          <SelectItem value="transactions">Transações</SelectItem>
                          <SelectItem value="accounts">Contas</SelectItem>
                          <SelectItem value="goals">Objetivos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button>Salvar preferências</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Segurança</CardTitle>
                  <CardDescription>Gerencie suas configurações de segurança.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Senha atual</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">Nova senha</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmar nova senha</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button>Alterar senha</Button>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="two-factor">Autenticação de dois fatores</Label>
                          <p className="text-sm text-muted-foreground">
                            Adicione uma camada extra de segurança à sua conta.
                          </p>
                        </div>
                        <Switch id="two-factor" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="biometric">Autenticação biométrica</Label>
                          <p className="text-sm text-muted-foreground">
                            Use sua impressão digital ou reconhecimento facial para acessar o aplicativo.
                          </p>
                        </div>
                        <Switch id="biometric" defaultChecked />
                      </div>
                    </div>
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

