"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PiggyBank, User, Users } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { use, useState } from "react"

export default function PartnerSelectionPage() {
  const router = useRouter()
  const [showPartnerInput, setShowPartnerInput] = useState(false)
  const [partnerEmail, setPartnerEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSoloSelection = () => {
    router.push("/dashboard")
  }

  const handlePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccessMessage(null)

    const userId = localStorage.getItem('user_id') 

    try {
      const res = await fetch("/api/partner-selection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: partnerEmail,
          user_id:userId,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Erro ao convidar parceiro")
      }

      setSuccessMessage(data.message || "Parceiro convidado com sucesso!")
      router.push("/dashboard?withPartner=true")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2">
            <PiggyBank className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">FinTrack</h1>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Como você quer controlar suas finanças?</CardTitle>
            <CardDescription>Escolha se deseja gerenciar suas finanças sozinho ou com um parceiro.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!showPartnerInput ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-32 flex flex-col gap-2" onClick={handleSoloSelection}>
                  <User className="h-8 w-8" />
                  <span>Controlar sozinho</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-32 flex flex-col gap-2"
                  onClick={() => setShowPartnerInput(true)}
                >
                  <Users className="h-8 w-8" />
                  <span>Controlar com alguém</span>
                </Button>
              </div>
            ) : (
              <form onSubmit={handlePartnerSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="partner-email">Email do parceiro</Label>
                  <Input
                    id="partner-email"
                    type="email"
                    placeholder="parceiro@email.com"
                    value={partnerEmail}
                    onChange={(e) => setPartnerEmail(e.target.value)}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Caso esse parceiro exista,será registrado para gerenciar suas finanças.
                  </p>
                </div>
                {error && (
                  <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md">
                    {error}
                  </div>
                )}
                {successMessage && (
                  <div className="p-3 bg-success/10 text-success text-sm rounded-md">
                    {successMessage}
                  </div>
                )}
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowPartnerInput(false)}>
                    Voltar
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Carregando..." : "Convidar parceiro"}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
          {!showPartnerInput && (
            <CardFooter className="flex justify-center">
              <p className="text-sm text-muted-foreground">Você pode alterar esta configuração mais tarde.</p>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  )
}
