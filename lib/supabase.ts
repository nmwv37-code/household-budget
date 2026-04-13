import { createClient } from '@supabase/supabase-js';
import { Transaction, TransactionType } from '@/app/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// DB row → Transaction
function rowToTransaction(row: {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: string;
  created_at: string;
}): Transaction {
  return {
    id: row.id,
    type: row.type,
    amount: row.amount,
    category: row.category,
    description: row.description,
    date: row.date,
    createdAt: row.created_at,
  };
}

export async function fetchTransactions(): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('date', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(rowToTransaction);
}

export async function insertTransaction(
  tx: Omit<Transaction, 'id' | 'createdAt'>
): Promise<Transaction> {
  const { data, error } = await supabase
    .from('transactions')
    .insert({
      type: tx.type,
      amount: tx.amount,
      category: tx.category,
      description: tx.description,
      date: tx.date,
    })
    .select()
    .single();
  if (error) throw error;
  return rowToTransaction(data);
}

export async function updateTransaction(
  id: string,
  tx: Omit<Transaction, 'id' | 'createdAt'>
): Promise<Transaction> {
  const { data, error } = await supabase
    .from('transactions')
    .update({
      type: tx.type,
      amount: tx.amount,
      category: tx.category,
      description: tx.description,
      date: tx.date,
    })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return rowToTransaction(data);
}

export async function deleteTransaction(id: string): Promise<void> {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id);
  if (error) throw error;
}
