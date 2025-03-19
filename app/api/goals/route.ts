import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

// GET: Retorna os objetivos do usuário com base no user_id passado via query string
export async function GET(req: Request) {
  const url = new URL(req.url)
  const user_id = url.searchParams.get('user_id')
  
  if (!user_id) {
    return NextResponse.json({ error: 'user_id é obrigatório.' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', user_id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ goals: data })
}

// POST: Cria um novo objetivo
export async function POST(req: Request) {
  try {
    const { user_id, name, description, target, current, dueDate, icon, color } = await req.json()

    // Validação básica
    if (!user_id || !name || !target) {
      return NextResponse.json({ error: 'Os campos user_id, name e target são obrigatórios.' }, { status: 400 })
    }

    // Monta o objeto do objetivo
    const newGoal = {
      user_id,
      name,
      description,
      target,
      current: current || 0,
      due_date: dueDate, // se necessário, converta para o formato DATE
      icon,            // Pode ser armazenado como string (ex.: "travel", "car", etc.)
      color
    }

    const { data, error } = await supabase
      .from('goals')
      .insert([newGoal])
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Objetivo criado com sucesso', goal: data })
  } catch (err) {
    console.error('Erro inesperado:', err)
    return NextResponse.json({ error: 'Erro inesperado ao processar o pedido.' }, { status: 500 })
  }
}
