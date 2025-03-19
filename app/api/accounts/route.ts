import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!)

export async function GET(req: Request) {
  try {
    // Recupera o parâmetro user_id da URL
    const url = new URL(req.url)
    const user_id = url.searchParams.get('user_id')

    if (!user_id) {
      return NextResponse.json({ error: 'user_id é obrigatório.' }, { status: 400 })
    }

    // Busca o perfil do host para obter o nome
    const { data: hostProfile, error: hostProfileError } = await supabase
      .from('fintrack_profile')
      .select('name')
      .eq('uuid', user_id)
      .single()

    if (hostProfileError) {
      console.error("Erro ao buscar perfil do host:", hostProfileError)
      return NextResponse.json({ error: 'Erro ao buscar perfil do host.' }, { status: 500 })
    }

    const hostName = hostProfile.name;

    // Verifica se o usuário tem um parceiro vinculado
    const { data: partnerRelationship, error: relationshipError } = await supabase
      .from('partner_relationships')
      .select('partner_user_id')
      .eq('host_user_id', user_id)
      .single()

    if (relationshipError) {
      console.error("Error checking partner relationship:", relationshipError)
      return NextResponse.json({ error: 'Erro ao verificar parceiro.' }, { status: 500 })
    }

    // Consultar contas do host
    const { data: hostBankAccounts, error: hostBankError } = await supabase
      .from('bank_accounts')
      .select('*')
      .eq('user_id', user_id)

    const { data: hostCreditCards, error: hostCreditError } = await supabase
      .from('credit_cards')
      .select('*')
      .eq('user_id', user_id)

    const { data: hostWallets, error: hostWalletError } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', user_id)

    if (hostBankError || hostCreditError || hostWalletError) {
      console.error("Error fetching host data:", hostBankError, hostCreditError, hostWalletError)
      return NextResponse.json({ error: 'Erro ao buscar dados das contas do host.' }, { status: 500 })
    }

    // Acrescenta o nome do responsável nas contas do host
    const hostBankAccountsWithOwner = hostBankAccounts.map(account => ({ ...account, responsavel: hostName }));
    const hostCreditCardsWithOwner = hostCreditCards.map(account => ({ ...account, responsavel: hostName }));
    const hostWalletsWithOwner = hostWallets.map(account => ({ ...account, responsavel: hostName }));

    // Consultar as contas do parceiro, se existir
    let partnerBankAccountsWithOwner = [];
    let partnerCreditCardsWithOwner = [];
    let partnerWalletsWithOwner = [];
    let partnerName: string | null = null;
    if (partnerRelationship?.partner_user_id) {
      const partnerUserId = partnerRelationship.partner_user_id;

      // Busca o perfil do parceiro para obter o nome
      const { data: partnerProfile, error: partnerProfileError } = await supabase
        .from('fintrack_profile')
        .select('name')
        .eq('uuid', partnerUserId)
        .single();

      if (partnerProfileError) {
        console.error("Erro ao buscar perfil do parceiro:", partnerProfileError);
        return NextResponse.json({ error: 'Erro ao buscar perfil do parceiro.' }, { status: 500 });
      }

      partnerName = partnerProfile.name;

      const { data: partnerBankData } = await supabase
        .from('bank_accounts')
        .select('*')
        .eq('user_id', partnerUserId);
      partnerBankAccountsWithOwner = (partnerBankData || []).map(account => ({ ...account, responsavel: partnerName }));

      const { data: partnerCardData } = await supabase
        .from('credit_cards')
        .select('*')
        .eq('user_id', partnerUserId);
      partnerCreditCardsWithOwner = (partnerCardData || []).map(account => ({ ...account, responsavel: partnerName }));

      const { data: partnerWalletData } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', partnerUserId);
      partnerWalletsWithOwner = (partnerWalletData || []).map(account => ({ ...account, responsavel: partnerName }));
    }

    // Retornar as informações combinadas com a indicação do responsável
    return NextResponse.json({
      host: {
        bankAccounts: hostBankAccountsWithOwner,
        creditCards: hostCreditCardsWithOwner,
        wallets: hostWalletsWithOwner,
      },
      partner: {
        bankAccounts: partnerBankAccountsWithOwner,
        creditCards: partnerCreditCardsWithOwner,
        wallets: partnerWalletsWithOwner,
      }
    })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: 'Erro inesperado ao processar o pedido.' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { user_id, accountType, name, balance, limit, dueDate } = await req.json()

    if (accountType === 'bank') {
      const { data, error } = await supabase
        .from('bank_accounts')
        .insert([{ user_id, name, balance }])

      if (error) {
        console.error("Error adding bank account:", error)
        return NextResponse.json({ error: 'Erro ao adicionar conta bancária.' }, { status: 400 })
      }

      return NextResponse.json({ message: 'Conta bancária adicionada com sucesso', data })
    }

    // Inserir novo cartão de crédito
    if (accountType === 'credit') {
      const { data, error } = await supabase
        .from('credit_cards')
        .insert([{ user_id, name, limit, due_date: dueDate }])

      if (error) {
        console.error("Error adding credit card:", error)
        return NextResponse.json({ error: 'Erro ao adicionar cartão de crédito.' }, { status: 400 })
      }

      return NextResponse.json({ message: 'Cartão de crédito adicionado com sucesso', data })
    }

    // Inserir nova carteira
    if (accountType === 'wallet') {
      const { data, error } = await supabase
        .from('wallets')
        .insert([{ user_id, name, balance }])

      if (error) {
        console.error("Error adding wallet:", error)
        return NextResponse.json({ error: 'Erro ao adicionar carteira.' }, { status: 400 })
      }

      return NextResponse.json({ message: 'Carteira adicionada com sucesso', data })
    }

    return NextResponse.json({ error: 'Tipo de conta inválido' }, { status: 400 })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: 'Erro inesperado ao processar o pedido.' }, { status: 500 })
  }
}
