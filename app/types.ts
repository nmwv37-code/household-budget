export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: string; // YYYY-MM-DD
  createdAt: string;
}

export const EXPENSE_CATEGORIES = [
  '식비',
  '교통',
  '쇼핑',
  '의료',
  '문화/여가',
  '교육',
  '공과금',
  '주거',
  '통신',
  '기타',
] as const;

export const INCOME_CATEGORIES = [
  '급여',
  '부업',
  '이자/배당',
  '용돈',
  '기타',
] as const;

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];
export type IncomeCategory = typeof INCOME_CATEGORIES[number];
