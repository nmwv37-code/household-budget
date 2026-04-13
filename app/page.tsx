'use client';

import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Transaction } from './types';
import { sampleTransactions } from './seed';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import TransactionForm from './components/TransactionForm';

const STORAGE_KEY = 'household-budget-transactions';

type Tab = 'dashboard' | 'transactions';

function loadTransactions(): Transaction[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
    // 처음 실행 시 샘플 데이터 로드
    saveTransactions(sampleTransactions);
    return sampleTransactions;
  } catch {
    return [];
  }
}

function saveTransactions(txs: Transaction[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(txs));
}

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [tab, setTab] = useState<Tab>('dashboard');
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [showForm, setShowForm] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  useEffect(() => {
    setTransactions(loadTransactions());
  }, []);

  const handleSave = useCallback((data: Omit<Transaction, 'id' | 'createdAt'>) => {
    setTransactions((prev) => {
      let updated: Transaction[];
      if (editingTx) {
        updated = prev.map((t) =>
          t.id === editingTx.id ? { ...t, ...data } : t
        );
      } else {
        const newTx: Transaction = {
          ...data,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        };
        updated = [...prev, newTx];
      }
      saveTransactions(updated);
      return updated;
    });
    setShowForm(false);
    setEditingTx(null);
  }, [editingTx]);

  const handleEdit = useCallback((tx: Transaction) => {
    setEditingTx(tx);
    setShowForm(true);
  }, []);

  const handleDelete = useCallback((id: string) => {
    setTransactions((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      saveTransactions(updated);
      return updated;
    });
  }, []);

  const handleCloseForm = useCallback(() => {
    setShowForm(false);
    setEditingTx(null);
  }, []);

  function changeMonth(delta: number) {
    const [y, m] = selectedMonth.split('-').map(Number);
    const d = new Date(y, m - 1 + delta, 1);
    setSelectedMonth(format(d, 'yyyy-MM'));
  }

  const monthLabel = format(new Date(selectedMonth + '-01'), 'yyyy년 M월', { locale: ko });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="mx-auto max-w-2xl px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900">내 가계부</h1>

          {/* Month Selector */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => changeMonth(-1)}
              className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors text-sm"
            >
              ‹
            </button>
            <span className="text-sm font-semibold text-gray-700 min-w-[90px] text-center">
              {monthLabel}
            </span>
            <button
              onClick={() => changeMonth(1)}
              className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors text-sm"
            >
              ›
            </button>
          </div>

          {/* Add Button */}
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 rounded-full bg-indigo-500 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-600 transition-colors shadow-sm"
          >
            <span className="text-base leading-none">+</span>
            추가
          </button>
        </div>

        {/* Tab */}
        <div className="mx-auto max-w-2xl px-4 flex gap-1 pb-0">
          {(['dashboard', 'transactions'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                tab === t
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              {t === 'dashboard' ? '대시보드' : '거래 내역'}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-2xl px-4 py-6">
        {tab === 'dashboard' ? (
          <Dashboard transactions={transactions} selectedMonth={selectedMonth} />
        ) : (
          <TransactionList
            transactions={transactions}
            selectedMonth={selectedMonth}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </main>

      {/* FAB for mobile */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-6 right-6 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500 text-white text-2xl shadow-lg hover:bg-indigo-600 active:scale-95 transition-all sm:hidden"
        aria-label="거래 추가"
      >
        +
      </button>

      {/* Form Modal */}
      {showForm && (
        <TransactionForm
          transaction={editingTx}
          onSave={handleSave}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}
