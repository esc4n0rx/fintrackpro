import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import logger from '@/lib/logger' // Certifique-se de que o caminho está correto

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const user_id = url.searchParams.get('user_id')

    if (!user_id) {
      return NextResponse.json({ error: 'user_id é obrigatório.' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user_id)
      .order('date', { ascending: false })

    if (error) {
      logger.error("Erro ao buscar transações:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ transactions: data })
  } catch (err) {
    logger.error(err)
    return NextResponse.json({ error: 'Erro inesperado ao processar o pedido.' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { user_id, description, amount, date, category, account, type, is_recurring } = await req.json()

    logger.info("Dados recebidos na transação:", { user_id, description, amount, date, category, account, type, is_recurring })

    if (!user_id || !description || !amount || !date || !category || !account || !type) {
      return NextResponse.json({ error: 'Campos obrigatórios ausentes.' }, { status: 400 })
    }

    // Insere a transação na tabela "transactions"
    const { data, error } = await supabase
      .from('transactions')
      .insert([
        {
          user_id,
          description,
          amount,
          date,
          category,
          account,
          type,
          is_recurring: is_recurring || false,
        }
      ])
      .single()

    if (error) {
      logger.error("Erro ao inserir transação:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Atualiza o saldo/limite da conta usando o ID da conta
    try {
      await updateAccountBalance(user_id, account, amount, type)
    } catch (err: any) {
      logger.error('Erro ao atualizar saldo da conta:', err)
      return NextResponse.json({ error: err.message }, { status: 500 })
    }

    // Se a transação for recorrente, cria uma nova transação para o próximo período (exemplo mensal)
    if (is_recurring) {
      const nextDate = new Date(date)
      nextDate.setMonth(nextDate.getMonth() + 1)
      await supabase
        .from('transactions')
        .insert([
          {
            user_id,
            description,
            amount,
            date: nextDate.toISOString().split('T')[0],
            category,
            account,
            type,
            is_recurring: true,
          }
        ])
    }

    logger.info("Transação inserida com sucesso:", data)
    return NextResponse.json({ message: 'Transação criada com sucesso', transaction: data })
  } catch (err) {
    logger.error('Erro inesperado:', err)
    return NextResponse.json({ error: 'Erro inesperado ao processar o pedido.' }, { status: 500 })
  }
}

// Função para atualizar o saldo/limite da conta conforme o tipo de conta
async function updateAccountBalance(user_id: string, accountId: string, amount: number, transactionType: string) {
  logger.info("Atualizando saldo para:", { user_id, accountId, amount, transactionType })

  // Tenta atualizar em bank_accounts (conta bancária)
  let { data: bankAccount, error: bankError } = await supabase
    .from('bank_accounts')
    .select('balance')
    .eq('id', accountId)
    .eq('user_id', user_id)
    .maybeSingle()

  logger.info("Resultado da consulta bank_accounts:", { bankAccount, bankError })

  if (bankAccount) {
    const newBalance = transactionType === 'income'
      ? bankAccount.balance + amount
      : bankAccount.balance - amount
    logger.info("Banco - saldo atual:", bankAccount.balance, "novo saldo:", newBalance)
    const { error: updateError } = await supabase
      .from('bank_accounts')
      .update({ balance: newBalance })
      .eq('user_id', user_id)
      .eq('id', accountId)
    if (updateError) {
      logger.error("Erro ao atualizar bank_accounts:", updateError)
      throw new Error(updateError.message)
    }
    logger.info("Atualização em bank_accounts realizada com sucesso.")
    return
  }

  // Tenta atualizar em credit_cards (cartão de crédito)
  let { data: creditCard, error: creditError } = await supabase
    .from('credit_cards')
    .select('limit')
    .eq('id', accountId)
    .eq('user_id', user_id)
    .maybeSingle()

  logger.info("Resultado da consulta credit_cards:", { creditCard, creditError })

  if (creditCard) {
    // Para cartão de crédito: se for expense, diminui o limite; se for income, aumenta o limite (limite pode ficar negativo)
    const newLimit = transactionType === 'expense'
      ? creditCard.limit - amount
      : creditCard.limit + amount
    logger.info("Cartão - limite atual:", creditCard.limit, "novo limite:", newLimit)
    const { error: updateError } = await supabase
      .from('credit_cards')
      .update({ limit: newLimit })
      .eq('user_id', user_id)
      .eq('id', accountId)
    if (updateError) {
      logger.error("Erro ao atualizar credit_cards:", updateError)
      throw new Error(updateError.message)
    }
    logger.info("Atualização em credit_cards realizada com sucesso.")
    return
  }

  // Tenta atualizar em wallets (carteira)
  let { data: wallet, error: walletError } = await supabase
    .from('wallets')
    .select('balance')
    .eq('id', accountId)
    .eq('user_id', user_id)
    .maybeSingle()

  logger.info("Resultado da consulta wallets:", { wallet, walletError })

  if (wallet) {
    const newBalance = transactionType === 'income'
      ? wallet.balance + amount
      : wallet.balance - amount
    logger.info("Carteira - saldo atual:", wallet.balance, "novo saldo:", newBalance)
    const { error: updateError } = await supabase
      .from('wallets')
      .update({ balance: newBalance })
      .eq('user_id', user_id)
      .eq('id', accountId)
    if (updateError) {
      logger.error("Erro ao atualizar wallets:", updateError)
      throw new Error(updateError.message)
    }
    logger.info("Atualização em wallets realizada com sucesso.")
    return
  }

  logger.error("Nenhuma conta encontrada para:", { user_id, accountId })
  throw new Error("Conta não encontrada")
}
