import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)

export async function POST(req: Request) {
  try {
    const { email, user_id } = await req.json()

    // Log para verificar os dados recebidos
    console.log("Received data:", { email, user_id })

    // Verificar se o parceiro já está registrado
    const { data: partner, error: partnerError } = await supabase
      .from('fintrack_profile')
      .select('uuid')
      .eq('email', email)
      .single()

    // Log para verificar o erro do parceiro ou dados retornados
    console.log("Partner data:", partner)
    if (partnerError || !partner) {
      console.error("Partner not found error:", partnerError)
      return NextResponse.json({ error: 'Parceiro não encontrado. Verifique o email fornecido.' }, { status: 400 })
    }

    // Verificar se o usuário já tem um parceiro vinculado
    const { data: existingRelationship, error: relationshipError } = await supabase
      .from('partner_relationships')
      .select('*')
      .eq('host_user_id', user_id)
      .eq('partner_user_id', partner.uuid)

    // Log para verificar erro no relacionamento
    console.log("Existing relationship:", existingRelationship)

    if (relationshipError) {
      console.error("Error checking existing relationship:", relationshipError)
      return NextResponse.json({ error: 'Erro ao verificar relacionamento.' }, { status: 500 })
    }

    // Verifica se existe um relacionamento
    if (existingRelationship && existingRelationship.length > 0) {
      console.log("Existing relationship found:", existingRelationship)
      return NextResponse.json({ error: 'Este parceiro já foi convidado para gerenciar as finanças.' }, { status: 400 })
    }

    // Criar vínculo de parceria entre o usuário (host) e o parceiro
    const { data: newRelationship, error: createError } = await supabase
      .from('partner_relationships')
      .insert([{ host_user_id: user_id, partner_user_id: partner.uuid }])
      .single()

    // Log para verificar erro na criação do vínculo
    console.log("New relationship data:", newRelationship)
    if (createError) {
      console.error("Error creating relationship:", createError)
      return NextResponse.json({ error: createError.message }, { status: 400 })
    }

    // Log de sucesso
    console.log("Partner successfully invited:", newRelationship)
    return NextResponse.json({ message: 'Parceiro convidado com sucesso!' })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: 'Erro inesperado ao processar o pedido.' }, { status: 500 })
  }
}
