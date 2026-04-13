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
        updated = prev.map((t) => (t.id === editingTx.id ? { ...t, ...data } : t));
      } else {
        updated = [...prev, { ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString() }];
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
    setSelectedMonth(format(new Date(y, m - 1 + delta, 1), 'yyyy-MM'));
  }

  const monthLabel = format(new Date(selectedMonth + '-01'), 'yyyy년 M월', { locale: ko });

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f0f2ff 0%, #fce4ec 50%, #e8f5e9 100%)' }}>

      {/* ── Hero Header ── */}
      <header className="relative overflow-hidden bg-mesh pt-8 pb-20 px-4">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, #a78bfa, #7c3aed)' }} />
        <div className="pointer-events-none absolute -bottom-10 -left-10 w-48 h-48 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #f9a8d4, #ec4899)' }} />

        <div className="relative mx-auto max-w-2xl">
          {/* Top row */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-white/70 text-xs font-medium tracking-widest uppercase mb-0.5">My Wallet</p>
              <h1 className="text-white text-2xl font-bold tracking-tight">내 가계부</h1>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-1.5 rounded-2xl px-5 py-2.5 text-sm font-semibold shadow-lg transition-all active:scale-95"
              style={{ background: 'rgba(255,255,255,0.25)', color: '#fff', border: '1px solid rgba(255,255,255,0.4)', backdropFilter: 'blur(8px)' }}
            >
              <span className="text-lg leading-none">+</span> 추가
            </button>
          </div>

          {/* Month selector */}
          <div className="flex items-center justify-center gap-3">
            <button onClick={() => changeMonth(-1)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:bg-white/20 transition-colors text-lg">
              ‹
            </button>
            <span className="text-white font-semibold text-base min-w-[100px] text-center">{monthLabel}</span>
            <button onClick={() => changeMonth(1)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:bg-white/20 transition-colors text-lg">
              ›
            </button>
          </div>
        </div>
      </header>

      {/* ── Tab bar (floating over hero) ── */}
      <div className="mx-auto max-w-2xl px-4 -mt-12 relative z-10 mb-4">
        <div className="rounded-2xl shadow-xl flex overflow-hidden p-1.5 gap-1.5"
          style={{ background: 'linear-gradient(135deg, #312e81, #4c1d95)' }}>
          {(['dashboard', 'transactions'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
                tab === t
                  ? 'text-indigo-700 shadow-lg'
                  : 'text-indigo-200 hover:text-white hover:bg-white/10'
              }`}
              style={tab === t ? { background: '#fff' } : {}}
            >
              {t === 'dashboard' ? '📊 대시보드' : '📋 거래 내역'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main ── */}
      <main className="mx-auto max-w-2xl px-4 pb-24">
        {tab === 'dashboard'
          ? <Dashboard transactions={transactions} selectedMonth={selectedMonth} />
          : <TransactionList transactions={transactions} selectedMonth={selectedMonth} onEdit={handleEdit} onDelete={handleDelete} />
        }
      </main>

      {/* FAB */}
      <button
        onClick={() => setShowForm(true)}
        aria-label="거래 추가"
        className="fixed bottom-6 right-6 z-20 sm:hidden w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-2xl text-white active:scale-95 transition-transform"
        style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
      >
        +
      </button>

      {showForm && (
        <TransactionForm transaction={editingTx} onSave={handleSave} onClose={handleCloseForm} />
      )}
    </div>
  );
}
