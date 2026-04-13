'use client';

import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Transaction } from '../types';
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Props {
  transactions: Transaction[];
  selectedMonth: string; // YYYY-MM
}

const PIE_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316',
  '#eab308', '#22c55e', '#14b8a6', '#0ea5e9', '#64748b',
];

function formatAmount(amount: number) {
  return amount.toLocaleString('ko-KR') + '원';
}

export default function Dashboard({ transactions, selectedMonth }: Props) {
  const monthlyData = useMemo(() => {
    const months = Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(new Date(selectedMonth + '-01'), 5 - i);
      return format(date, 'yyyy-MM');
    });

    return months.map((month) => {
      const start = startOfMonth(new Date(month + '-01'));
      const end = endOfMonth(new Date(month + '-01'));
      const filtered = transactions.filter((t) =>
        isWithinInterval(new Date(t.date), { start, end })
      );
      const income = filtered.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
      const expense = filtered.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
      return {
        month: format(new Date(month + '-01'), 'M월', { locale: ko }),
        수입: income,
        지출: expense,
      };
    });
  }, [transactions, selectedMonth]);

  const currentMonthTx = useMemo(() => {
    const start = startOfMonth(new Date(selectedMonth + '-01'));
    const end = endOfMonth(new Date(selectedMonth + '-01'));
    return transactions.filter((t) =>
      isWithinInterval(new Date(t.date), { start, end })
    );
  }, [transactions, selectedMonth]);

  const income = currentMonthTx.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = currentMonthTx.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = income - expense;

  const expenseByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    currentMonthTx.filter((t) => t.type === 'expense').forEach((t) => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [currentMonthTx]);

  const recentTx = useMemo(
    () => [...transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5),
    [transactions]
  );

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">이번 달 수입</p>
          <p className="text-2xl font-bold text-blue-600">{formatAmount(income)}</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">이번 달 지출</p>
          <p className="text-2xl font-bold text-red-500">{formatAmount(expense)}</p>
        </div>
        <div className={`rounded-2xl p-5 shadow-sm border ${balance >= 0 ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
          <p className="text-sm text-gray-500 mb-1">잔액</p>
          <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {balance >= 0 ? '+' : ''}{formatAmount(balance)}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Bar Chart */}
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">최근 6개월 수입/지출</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => (v / 10000).toFixed(0) + '만'} />
              <Tooltip formatter={(v) => formatAmount(Number(v))} />
              <Legend />
              <Bar dataKey="수입" fill="#60a5fa" radius={[4, 4, 0, 0]} />
              <Bar dataKey="지출" fill="#f87171" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">이번 달 카테고리별 지출</h3>
          {expenseByCategory.length === 0 ? (
            <div className="flex h-[220px] items-center justify-center text-gray-400 text-sm">
              지출 내역이 없습니다
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={expenseByCategory}
                  cx="40%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  labelLine={false}
                >
                  {expenseByCategory.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => formatAmount(Number(v))} />
                <Legend
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                  formatter={(value, entry) => {
                    const total = expenseByCategory.reduce((s, c) => s + c.value, 0);
                    const entryValue = (entry as { payload?: { value?: number } }).payload?.value ?? 0;
                    const pct = total > 0 ? Math.round((entryValue / total) * 100) : 0;
                    return `${value} ${pct}%`;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">최근 거래 내역</h3>
        {recentTx.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-6">거래 내역이 없습니다</p>
        ) : (
          <ul className="divide-y divide-gray-50">
            {recentTx.map((tx) => (
              <li key={tx.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <span className={`text-lg ${tx.type === 'income' ? 'text-blue-400' : 'text-red-400'}`}>
                    {tx.type === 'income' ? '↑' : '↓'}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{tx.description || tx.category}</p>
                    <p className="text-xs text-gray-400">{tx.category} · {tx.date}</p>
                  </div>
                </div>
                <span className={`text-sm font-semibold ${tx.type === 'income' ? 'text-blue-600' : 'text-red-500'}`}>
                  {tx.type === 'income' ? '+' : '-'}{formatAmount(tx.amount)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
