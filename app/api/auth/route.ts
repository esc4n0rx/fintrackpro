import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)

export async function POST(req: Request) {
  const { email, password, name } = await req.json()

  if (name && email && password) {
    // Verifica se o usuário já existe na tabela 'fintrack_profile'
    const { data: existingUser, error: userCheckError } = await supabase
      .from('fintrack_profile')
      .select('*')
      .eq('email', email)
      .single()

    if (userCheckError && userCheckError.code !== 'PGRST116') {
      return NextResponse.json({ error: 'Erro ao verificar usuário' }, { status: 400 })
    }

    if (existingUser) {
      return NextResponse.json({ error: 'Usuário já existe' }, { status: 400 })
    }

    // Se o usuário não existir, insere um novo usuário na tabela
    const { data: newUser, error: insertError } = await supabase
      .from('fintrack_profile')
      .insert([{ email, name, password }])  // Adiciona senha ou, idealmente, faça uma hash dela
      .single()

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 400 })
    }

    return NextResponse.json({ message: 'Usuário registrado com sucesso', user: newUser })
  } else {
    // Verifica as credenciais do usuário para o login
    const { data: user, error: loginError } = await supabase
      .from('fintrack_profile')
      .select('*')
      .eq('email', email)
      .eq('password', password)  // Note: Hash a senha para segurança, isso é só um exemplo!
      .single()

    // Verifica se o usuário já tem um parceiro (seja como host ou parceiro)
    const { data: relationship, error: relationshipError } = await supabase
    .from('partner_relationships')
    .select('*')
    .or(`host_user_id.eq.${user.uuid},partner_user_id.eq.${user.uuid}`)

    if (relationshipError) {
    return NextResponse.json({ error: 'Erro ao verificar relacionamento' }, { status: 500 })
    }

    const hasPartner = relationship && relationship.length > 0

    // Retorne a flag junto com os dados do usuário
    return NextResponse.json({ 
    message: 'Login bem-sucedido', 
    user: { uuid: user.uuid },
    hasPartner 
    })
  }
}
