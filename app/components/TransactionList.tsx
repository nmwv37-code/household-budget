'use client';

import { useMemo, useState } from 'react';
import { Transaction, TransactionType } from '../types';
import { getCategoryMeta } from '../categoryMeta';
import { startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

interface Props {
  transactions: Transaction[];
  selectedMonth: string;
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
}

function fmt(n: number) { return n.toLocaleString('ko-KR') + '원'; }

const TYPE_LABELS: Record<TransactionType | 'all', string> = {
  all: '전체', income: '수입', expense: '지출',
};

export default function TransactionList({ transactions, selectedMonth, onEdit, onDelete }: Props) {
  const [typeFilter, setTypeFilter] = useState<TransactionType | 'all'>('all');
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const start = startOfMonth(new Date(selectedMonth + '-01'));
    const end = endOfMonth(new Date(selectedMonth + '-01'));
    return transactions
      .filter((t) => isWithinInterval(new Date(t.date), { start, end }))
      .filter((t) => typeFilter === 'all' || t.type === typeFilter)
      .filter((t) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q);
      })
      .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
  }, [transactions, selectedMonth, typeFilter, search]);

  const totalIncome = filtered.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = filtered.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  const grouped = useMemo(() => {
    const map: Record<string, Transaction[]> = {};
    filtered.forEach((t) => { (map[t.date] ??= []).push(t); });
    return Object.entries(map).sort(([a], [b]) => b.localeCompare(a));
  }, [filtered]);

  function handleDelete(id: string) {
    if (deleteConfirm === id) { onDelete(id); setDeleteConfirm(null); }
    else { setDeleteConfirm(id); setTimeout(() => setDeleteConfirm(null), 3000); }
  }

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="glass-white rounded-2xl p-3 shadow-md flex flex-col gap-2.5 sm:flex-row sm:items-center">
        <div className="flex rounded-xl overflow-hidden border border-gray-100 self-start shrink-0">
          {(['all', 'expense', 'income'] as const).map((t) => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`px-4 py-1.5 text-sm font-semibold transition-all ${
                typeFilter === t
                  ? t === 'expense' ? 'text-white' : t === 'income' ? 'text-white' : 'text-white'
                  : 'bg-white text-gray-400 hover:text-gray-600'
              }`}
              style={typeFilter === t ? {
                background: t === 'expense'
                  ? 'linear-gradient(135deg,#f43f5e,#fb923c)'
                  : t === 'income'
                  ? 'linear-gradient(135deg,#3b82f6,#06b6d4)'
                  : 'linear-gradient(135deg,#6366f1,#8b5cf6)'
              } : {}}
            >
              {TYPE_LABELS[t]}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍  카테고리, 메모 검색..."
          className="flex-1 rounded-xl border border-gray-100 bg-gray-50 px-3.5 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        />
      </div>

      {/* Summary pill */}
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="rounded-full px-3 py-1 text-gray-500 font-medium" style={{ background: 'rgba(255,255,255,0.8)' }}>
          총 {filtered.length}건
        </span>
        <span className="rounded-full px-3 py-1 font-semibold text-blue-600" style={{ background: 'rgba(219,234,254,0.8)' }}>
          수입 +{fmt(totalIncome)}
        </span>
        <span className="rounded-full px-3 py-1 font-semibold text-rose-500" style={{ background: 'rgba(255,228,230,0.8)' }}>
          지출 -{fmt(totalExpense)}
        </span>
      </div>

      {/* List */}
      {grouped.length === 0 ? (
        <div className="glass-white rounded-3xl p-12 text-center shadow-md flex flex-col items-center gap-3">
          <span className="text-5xl">📭</span>
          <p className="text-gray-400 text-sm">거래 내역이 없습니다</p>
        </div>
      ) : (
        <div className="space-y-3">
          {grouped.map(([date, txs]) => {
            const dayIncome = txs.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
            const dayExpense = txs.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
            const [, month, day] = date.split('-');
            const weekday = ['일', '월', '화', '수', '목', '금', '토'][new Date(date).getDay()];
            return (
              <div key={date} className="glass-white rounded-3xl shadow-md overflow-hidden">
                {/* Date header */}
                <div className="flex items-center justify-between px-4 py-3"
                  style={{ background: 'linear-gradient(135deg, rgba(238,242,255,0.9), rgba(253,244,255,0.9))' }}>
                  <span className="text-sm font-bold text-indigo-700">
                    {month}월 {day}일
                    <span className="ml-1.5 text-xs font-medium text-indigo-400">({weekday})</span>
                  </span>
                  <div className="flex gap-2 text-xs font-semibold">
                    {dayIncome > 0 && <span className="text-blue-500">+{fmt(dayIncome)}</span>}
                    {dayExpense > 0 && <span className="text-rose-400">-{fmt(dayExpense)}</span>}
                  </div>
                </div>

                {/* Items */}
                <ul className="divide-y divide-gray-50">
                  {txs.map((tx) => {
                    const meta = getCategoryMeta(tx.category);
                    return (
                      <li key={tx.id} className="flex items-center justify-between px-4 py-3 gap-3 group hover:bg-gray-50/50 transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className={`shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center text-lg ${meta.bg}`}>
                            {meta.icon}
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">{tx.description || tx.category}</p>
                            {tx.description && <p className="text-xs text-gray-400">{tx.category}</p>}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-sm font-bold ${tx.type === 'income' ? 'text-blue-500' : 'text-rose-500'}`}>
                            {tx.type === 'income' ? '+' : '-'}{fmt(tx.amount)}
                          </span>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => onEdit(tx)}
                              className="rounded-lg px-2 py-1 text-xs text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors font-medium">
                              수정
                            </button>
                            <button onClick={() => handleDelete(tx.id)}
                              className={`rounded-lg px-2 py-1 text-xs font-medium transition-colors ${
                                deleteConfirm === tx.id
                                  ? 'text-white' : 'text-gray-400 hover:bg-rose-50 hover:text-rose-500'
                              }`}
                              style={deleteConfirm === tx.id ? { background: 'linear-gradient(135deg,#f43f5e,#fb923c)' } : {}}>
                              {deleteConfirm === tx.id ? '확인' : '삭제'}
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
