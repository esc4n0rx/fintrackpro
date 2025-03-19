import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, BarChart3, PiggyBank, TrendingUp } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <header className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <PiggyBank className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">FinTrack</h1>
          </div>
          <Link href="/login">
            <Button variant="ghost">Entrar</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Controle suas finanças com facilidade</h2>
            <p className="text-xl text-muted-foreground">
              Acompanhe seus gastos, gerencie suas contas e planeje seu futuro financeiro com o FinTrack.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/login">
                <Button size="lg" className="gap-2">
                  Vamos Começar <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                Saiba mais
              </Button>
            </div>
          </div>
          <div className="flex-1">
            <Image
              src="/placeholder.svg?height=400&width=500"
              width={500}
              height={400}
              alt="Dashboard preview"
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Visualize seus gastos</h3>
                <p className="text-muted-foreground">Gráficos intuitivos para entender para onde vai seu dinheiro.</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Previsões financeiras</h3>
                <p className="text-muted-foreground">
                  Antecipe sua situação financeira e evite surpresas desagradáveis.
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <PiggyBank className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Defina objetivos</h3>
                <p className="text-muted-foreground">Estabeleça metas financeiras e acompanhe seu progresso.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t mt-24 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 FinTrack. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

