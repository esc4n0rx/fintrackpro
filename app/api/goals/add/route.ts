import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)

export async function PATCH(req: Request) {
  try {
    const { goal_id, addAmount } = await req.json()

    if (!goal_id || addAmount == null) {
      return NextResponse.json({ error: "goal_id e addAmount são obrigatórios." }, { status: 400 })
    }

    // Busca o valor atual do objetivo
    const { data: goal, error: getError } = await supabase
      .from('goals')
      .select('current')
      .eq('id', goal_id)
      .single()

    if (getError || !goal) {
      return NextResponse.json({ error: getError?.message || "Objetivo não encontrado." }, { status: 400 })
    }

    const newCurrent = Number(goal.current) + Number(addAmount)

    const { data: updatedGoal, error: updateError } = await supabase
      .from('goals')
      .update({ current: newCurrent })
      .eq('id', goal_id)
      .single()

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 })
    }

    return NextResponse.json({ message: "Valor adicionado com sucesso", goal: updatedGoal })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Erro inesperado ao processar o pedido." }, { status: 500 })
  }
}
