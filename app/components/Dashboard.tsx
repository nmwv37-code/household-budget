'use client';

import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { Transaction } from '../types';
import { getCategoryMeta } from '../categoryMeta';
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Props {
  transactions: Transaction[];
  selectedMonth: string;
}

const PIE_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316',
  '#eab308', '#22c55e', '#14b8a6', '#0ea5e9', '#64748b',
];

function fmt(n: number) { return n.toLocaleString('ko-KR') + '원'; }

export default function Dashboard({ transactions, selectedMonth }: Props) {
  const monthlyData = useMemo(() => {
    const months = Array.from({ length: 6 }, (_, i) =>
      format(subMonths(new Date(selectedMonth + '-01'), 5 - i), 'yyyy-MM')
    );
    return months.map((month) => {
      const start = startOfMonth(new Date(month + '-01'));
      const end = endOfMonth(new Date(month + '-01'));
      const f = transactions.filter((t) => isWithinInterval(new Date(t.date), { start, end }));
      return {
        month: format(new Date(month + '-01'), 'M월', { locale: ko }),
        수입: f.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0),
        지출: f.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
      };
    });
  }, [transactions, selectedMonth]);

  const currentTx = useMemo(() => {
    const start = startOfMonth(new Date(selectedMonth + '-01'));
    const end = endOfMonth(new Date(selectedMonth + '-01'));
    return transactions.filter((t) => isWithinInterval(new Date(t.date), { start, end }));
  }, [transactions, selectedMonth]);

  const income = currentTx.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = currentTx.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = income - expense;
  const savingsRate = income > 0 ? Math.round(((income - expense) / income) * 100) : 0;

  const expenseByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    currentTx.filter((t) => t.type === 'expense').forEach((t) => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [currentTx]);

  const totalExpense = expenseByCategory.reduce((s, c) => s + c.value, 0);

  const recentTx = useMemo(
    () => [...transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5),
    [transactions]
  );

  return (
    <div className="space-y-4">

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-2 gap-3">
        {/* Balance (wide) */}
        <div
          className="col-span-2 rounded-3xl p-5 text-white relative overflow-hidden shadow-lg"
          style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)' }}
        >
          <div className="pointer-events-none absolute -right-8 -top-8 w-36 h-36 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #fff, transparent)' }} />
          <div className="pointer-events-none absolute -right-2 bottom-0 w-24 h-24 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #fff, transparent)' }} />
          <p className="text-white/70 text-xs font-medium mb-1">이번 달 잔액</p>
          <p className="text-3xl font-bold tracking-tight">
            {balance >= 0 ? '+' : ''}{fmt(balance)}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
              style={{ background: 'rgba(255,255,255,0.2)' }}>
              저축률 {savingsRate}%
            </span>
          </div>
        </div>

        {/* Income */}
        <div className="rounded-3xl p-4 text-white shadow-md relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}>
          <div className="pointer-events-none absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #fff, transparent)' }} />
          <p className="text-white/70 text-xs mb-1">수입</p>
          <p className="text-xl font-bold truncate">{fmt(income)}</p>
          <p className="mt-2 text-2xl">💰</p>
        </div>

        {/* Expense */}
        <div className="rounded-3xl p-4 text-white shadow-md relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #f43f5e, #fb923c)' }}>
          <div className="pointer-events-none absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #fff, transparent)' }} />
          <p className="text-white/70 text-xs mb-1">지출</p>
          <p className="text-xl font-bold truncate">{fmt(expense)}</p>
          <p className="mt-2 text-2xl">💸</p>
        </div>
      </div>

      {/* ── Bar Chart ── */}
      <div className="glass-white rounded-3xl p-5 shadow-md">
        <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg flex items-center justify-center text-xs"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            <span className="text-white">📊</span>
          </span>
          최근 6개월 수입/지출
        </h3>
        <ResponsiveContainer width="100%" height={190}>
          <BarChart data={monthlyData} barCategoryGap="30%" margin={{ top: 0, right: 0, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickFormatter={(v) => (v / 10000).toFixed(0) + '만'} width={34} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }}
              formatter={(v) => fmt(Number(v))}
            />
            <Bar dataKey="수입" fill="url(#incomeGrad)" radius={[6, 6, 0, 0]} />
            <Bar dataKey="지출" fill="url(#expenseGrad)" radius={[6, 6, 0, 0]} />
            <defs>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
              <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fb7185" />
                <stop offset="100%" stopColor="#f43f5e" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-5 mt-1">
          <span className="flex items-center gap-1.5 text-xs text-gray-400">
            <span className="w-3 h-3 rounded-sm" style={{ background: 'linear-gradient(#60a5fa,#3b82f6)' }} />수입
          </span>
          <span className="flex items-center gap-1.5 text-xs text-gray-400">
            <span className="w-3 h-3 rounded-sm" style={{ background: 'linear-gradient(#fb7185,#f43f5e)' }} />지출
          </span>
        </div>
      </div>

      {/* ── Pie Chart ── */}
      <div className="glass-white rounded-3xl p-5 shadow-md">
        <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg flex items-center justify-center text-xs"
            style={{ background: 'linear-gradient(135deg, #f43f5e, #fb923c)' }}>
            <span className="text-white">🎯</span>
          </span>
          이번 달 카테고리별 지출
        </h3>
        {expenseByCategory.length === 0 ? (
          <div className="flex h-36 items-center justify-center text-gray-300 text-sm flex-col gap-2">
            <span className="text-4xl">🌿</span>지출 내역이 없습니다
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={170}>
              <PieChart>
                <Pie data={expenseByCategory} cx="50%" cy="50%" outerRadius={78} innerRadius={44} dataKey="value" labelLine={false} strokeWidth={0}>
                  {expenseByCategory.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }}
                  formatter={(v) => fmt(Number(v))}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-x-3 gap-y-2 mt-2 sm:grid-cols-3">
              {expenseByCategory.map((item, i) => {
                const pct = totalExpense > 0 ? Math.round((item.value / totalExpense) * 100) : 0;
                const meta = getCategoryMeta(item.name);
                return (
                  <div key={item.name} className="flex items-center gap-2 min-w-0">
                    <span className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-sm ${meta.bg}`}>
                      {meta.icon}
                    </span>
                    <span className="text-xs text-gray-600 truncate flex-1">{item.name}</span>
                    <span className="text-xs font-bold shrink-0" style={{ color: PIE_COLORS[i % PIE_COLORS.length] }}>
                      {pct}%
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* ── Recent Transactions ── */}
      <div className="glass-white rounded-3xl p-5 shadow-md">
        <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg flex items-center justify-center text-xs"
            style={{ background: 'linear-gradient(135deg, #22c55e, #14b8a6)' }}>
            <span className="text-white">🕐</span>
          </span>
          최근 거래 내역
        </h3>
        {recentTx.length === 0 ? (
          <p className="text-center text-gray-300 text-sm py-6 flex flex-col gap-2 items-center">
            <span className="text-4xl">📭</span>거래 내역이 없습니다
          </p>
        ) : (
          <ul className="space-y-2">
            {recentTx.map((tx) => {
              const meta = getCategoryMeta(tx.category);
              return (
                <li key={tx.id} className="flex items-center justify-between gap-3 rounded-2xl p-3"
                  style={{ background: 'rgba(248,250,252,0.8)' }}>
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center text-lg ${meta.bg}`}>
                      {meta.icon}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{tx.description || tx.category}</p>
                      <p className="text-xs text-gray-400">{tx.category} · {tx.date}</p>
                    </div>
                  </div>
                  <span className={`shrink-0 text-sm font-bold ${tx.type === 'income' ? 'text-blue-500' : 'text-rose-500'}`}>
                    {tx.type === 'income' ? '+' : '-'}{fmt(tx.amount)}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
