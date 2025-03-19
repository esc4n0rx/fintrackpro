import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

export async function GET(req: Request) {
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
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ transactions: data })
}

// POST: Cria uma nova transação (despesa ou receita)
export async function POST(req: Request) {
  try {
    const { user_id, description, amount, date, category, account, type, is_recurring } = await req.json()

    // Validação básica
    if (!user_id || !description || !amount || !date || !category || !account || !type) {
      return NextResponse.json({ error: 'Campos obrigatórios ausentes.' }, { status: 400 })
    }

    // Insere a transação no banco
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
          is_recurring: is_recurring || false, // marca como recorrente se necessário
        }
      ])
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Atualiza o saldo da conta após a transação
    await updateAccountBalance(account, amount, type)

    // Se for uma despesa recorrente, cria a próxima transação
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
            date: nextDate.toISOString().split('T')[0], // Define a data para o próximo mês
            category,
            account,
            type,
            is_recurring: true,
          }
        ])
    }

    return NextResponse.json({ message: 'Transação criada com sucesso', transaction: data })
  } catch (err) {
    console.error('Erro inesperado:', err)
    return NextResponse.json({ error: 'Erro inesperado ao processar o pedido.' }, { status: 500 })
  }
}

// PATCH: Atualiza o saldo de uma conta após uma transação
async function updateAccountBalance(account: string, amount: number, type: string) {
  try {
    // Verifica a conta e ajusta o saldo
    const { data: accountData, error } = await supabase
      .from('accounts')
      .select('balance')
      .eq('name', account)
      .single()

    if (error) {
      throw new Error('Conta não encontrada')
    }

    const newBalance = type === 'income' 
      ? accountData.balance + amount 
      : accountData.balance - amount

    // Atualiza o saldo da conta
    await supabase
      .from('accounts')
      .update({ balance: newBalance })
      .eq('name', account)
  } catch (err) {
    console.error('Erro ao atualizar saldo da conta:', err)
    throw new Error('Erro ao atualizar saldo da conta')
  }
}

// DELETE: Excluir uma transação
export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url)
    const transaction_id = url.pathname.split('/').pop()

    if (!transaction_id) {
      return NextResponse.json({ error: 'transaction_id é necessário' }, { status: 400 })
    }

    // Deleta a transação do banco de dados
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', transaction_id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Se a transação excluída for de receita ou despesa, atualiza o saldo da conta
    const { data: deletedTransaction } = await supabase
      .from('transactions')
      .select('account, amount, type')
      .eq('id', transaction_id)
      .single()

    if (deletedTransaction) {
      await updateAccountBalance(deletedTransaction.account, deletedTransaction.amount, deletedTransaction.type)
    }

    return NextResponse.json({ message: 'Transação excluída com sucesso' })
  } catch (err) {
    console.error('Erro ao excluir transação:', err)
    return NextResponse.json({ error: 'Erro ao excluir transação' }, { status: 500 })
  }
}
