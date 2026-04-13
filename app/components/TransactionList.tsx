'use client';

import { useMemo, useState } from 'react';
import { Transaction, TransactionType } from '../types';
import { startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

interface Props {
  transactions: Transaction[];
  selectedMonth: string;
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
}

function formatAmount(amount: number) {
  return amount.toLocaleString('ko-KR') + '원';
}

const TYPE_LABELS: Record<TransactionType | 'all', string> = {
  all: '전체',
  income: '수입',
  expense: '지출',
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
        return (
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
  }, [transactions, selectedMonth, typeFilter, search]);

  const totalIncome = filtered.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = filtered.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  // Group by date
  const grouped = useMemo(() => {
    const map: Record<string, Transaction[]> = {};
    filtered.forEach((t) => {
      if (!map[t.date]) map[t.date] = [];
      map[t.date].push(t);
    });
    return Object.entries(map).sort(([a], [b]) => b.localeCompare(a));
  }, [filtered]);

  function handleDelete(id: string) {
    if (deleteConfirm === id) {
      onDelete(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex rounded-xl overflow-hidden border border-gray-200 self-start">
          {(['all', 'expense', 'income'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-4 py-1.5 text-sm font-medium transition-colors ${
                typeFilter === t
                  ? t === 'expense'
                    ? 'bg-red-500 text-white'
                    : t === 'income'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-700 text-white'
                  : 'bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              {TYPE_LABELS[t]}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="카테고리, 메모 검색..."
          className="flex-1 rounded-xl border border-gray-200 px-4 py-1.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
      </div>

      {/* Summary Bar */}
      <div className="flex gap-4 rounded-xl bg-white px-5 py-3 shadow-sm border border-gray-100 text-sm">
        <span className="text-gray-500">{filtered.length}건</span>
        <span className="text-blue-600 font-medium">수입 +{formatAmount(totalIncome)}</span>
        <span className="text-red-500 font-medium">지출 -{formatAmount(totalExpense)}</span>
      </div>

      {/* List */}
      {grouped.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center text-gray-400 text-sm shadow-sm border border-gray-100">
          거래 내역이 없습니다
        </div>
      ) : (
        <div className="space-y-3">
          {grouped.map(([date, txs]) => {
            const dayIncome = txs.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
            const dayExpense = txs.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
            const [, month, day] = date.split('-');
            const weekday = ['일', '월', '화', '수', '목', '금', '토'][new Date(date).getDay()];
            return (
              <div key={date} className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
                {/* Date Header */}
                <div className="flex items-center justify-between px-5 py-2.5 bg-gray-50 border-b border-gray-100">
                  <span className="text-sm font-semibold text-gray-700">
                    {month}월 {day}일 ({weekday})
                  </span>
                  <div className="flex gap-3 text-xs">
                    {dayIncome > 0 && <span className="text-blue-500">+{formatAmount(dayIncome)}</span>}
                    {dayExpense > 0 && <span className="text-red-400">-{formatAmount(dayExpense)}</span>}
                  </div>
                </div>

                {/* Transactions */}
                <ul className="divide-y divide-gray-50">
                  {txs.map((tx) => (
                    <li key={tx.id} className="flex items-center justify-between px-5 py-3 group">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`shrink-0 text-base ${tx.type === 'income' ? 'text-blue-400' : 'text-red-400'}`}>
                          {tx.type === 'income' ? '↑' : '↓'}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">
                            {tx.description || tx.category}
                          </p>
                          {tx.description && (
                            <p className="text-xs text-gray-400">{tx.category}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`text-sm font-semibold ${tx.type === 'income' ? 'text-blue-600' : 'text-red-500'}`}>
                          {tx.type === 'income' ? '+' : '-'}{formatAmount(tx.amount)}
                        </span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onEdit(tx)}
                            className="rounded-lg px-2 py-1 text-xs text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => handleDelete(tx.id)}
                            className={`rounded-lg px-2 py-1 text-xs transition-colors ${
                              deleteConfirm === tx.id
                                ? 'bg-red-500 text-white'
                                : 'text-gray-400 hover:bg-red-50 hover:text-red-500'
                            }`}
                          >
                            {deleteConfirm === tx.id ? '확인' : '삭제'}
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
