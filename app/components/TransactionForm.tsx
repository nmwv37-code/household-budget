'use client';

import { useState, useEffect } from 'react';
import { Transaction, TransactionType, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../types';
import { getCategoryMeta } from '../categoryMeta';
import { format } from 'date-fns';

interface Props {
  transaction?: Transaction | null;
  onSave: (tx: Omit<Transaction, 'id' | 'createdAt'>) => void;
  onClose: () => void;
}

export default function TransactionForm({ transaction, onSave, onClose }: Props) {
  const [type, setType] = useState<TransactionType>(transaction?.type ?? 'expense');
  const [amount, setAmount] = useState(transaction ? String(transaction.amount) : '');
  const [category, setCategory] = useState(transaction?.category ?? '');
  const [description, setDescription] = useState(transaction?.description ?? '');
  const [date, setDate] = useState(transaction?.date ?? format(new Date(), 'yyyy-MM-dd'));

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  useEffect(() => {
    if (!categories.includes(category as never)) setCategory('');
  }, [type]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const num = Number(amount.replace(/,/g, ''));
    if (!num || num <= 0 || !category || !date) return;
    onSave({ type, amount: num, category, description, date });
  }

  function handleAmountChange(v: string) {
    const digits = v.replace(/[^0-9]/g, '');
    setAmount(digits ? Number(digits).toLocaleString('ko-KR') : '');
  }

  const isIncome = type === 'income';
  const gradientBtn = isIncome
    ? 'linear-gradient(135deg,#3b82f6,#06b6d4)'
    : 'linear-gradient(135deg,#f43f5e,#fb923c)';
  const gradientHeader = isIncome
    ? 'linear-gradient(135deg,#3b82f6,#06b6d4)'
    : 'linear-gradient(135deg,#f43f5e,#fb923c)';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl overflow-hidden">

        {/* Gradient header */}
        <div className="relative px-6 pt-6 pb-8 text-white" style={{ background: gradientHeader }}>
          <div className="pointer-events-none absolute -right-6 -top-6 w-28 h-28 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle,#fff,transparent)' }} />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-xs font-medium">
                {transaction ? '거래 수정' : '새 거래 추가'}
              </p>
              <h2 className="text-xl font-bold mt-0.5">
                {isIncome ? '💰 수입 기록' : '💸 지출 기록'}
              </h2>
            </div>
            <button onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white/80 hover:bg-white/20 text-xl transition-colors">
              ×
            </button>
          </div>

          {/* Type toggle inside header */}
          <div className="mt-4 flex rounded-2xl overflow-hidden p-1" style={{ background: 'rgba(0,0,0,0.15)' }}>
            <button type="button" onClick={() => setType('expense')}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                !isIncome ? 'bg-white text-rose-500 shadow-sm' : 'text-white/70 hover:text-white'
              }`}>
              지출
            </button>
            <button type="button" onClick={() => setType('income')}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                isIncome ? 'bg-white text-blue-500 shadow-sm' : 'text-white/70 hover:text-white'
              }`}>
              수입
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pt-5 pb-6 space-y-4">
          {/* Amount */}
          <div className="rounded-2xl border-2 border-gray-100 bg-gray-50 px-4 py-3 focus-within:border-indigo-300 transition-colors">
            <p className="text-xs font-medium text-gray-400 mb-1">금액</p>
            <div className="flex items-center gap-1">
              <input
                type="text"
                inputMode="numeric"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="0"
                required
                className="flex-1 bg-transparent text-right text-2xl font-bold text-gray-800 focus:outline-none"
              />
              <span className="text-gray-400 text-base font-medium">원</span>
            </div>
          </div>

          {/* Category */}
          <div>
            <p className="text-xs font-medium text-gray-500 mb-2">카테고리</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const meta = getCategoryMeta(cat);
                const selected = category === cat;
                return (
                  <button type="button" key={cat} onClick={() => setCategory(cat)}
                    className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold border-2 transition-all ${
                      selected
                        ? 'border-transparent text-white shadow-md scale-105'
                        : `border-transparent ${meta.bg} ${meta.color} hover:scale-105`
                    }`}
                    style={selected ? { background: gradientBtn } : {}}>
                    <span>{meta.icon}</span>
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div className="rounded-2xl border-2 border-gray-100 bg-gray-50 px-4 py-3 focus-within:border-indigo-300 transition-colors">
            <p className="text-xs font-medium text-gray-400 mb-1">메모 (선택)</p>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="내용을 입력하세요"
              maxLength={50}
              className="w-full bg-transparent text-sm text-gray-800 focus:outline-none"
            />
          </div>

          {/* Date */}
          <div className="rounded-2xl border-2 border-gray-100 bg-gray-50 px-4 py-3 focus-within:border-indigo-300 transition-colors">
            <p className="text-xs font-medium text-gray-400 mb-1">날짜</p>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full bg-transparent text-sm text-gray-800 focus:outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 rounded-2xl border-2 border-gray-100 py-3 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors">
              취소
            </button>
            <button type="submit" disabled={!amount || !category}
              className="flex-1 rounded-2xl py-3 text-sm font-bold text-white shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-98"
              style={!amount || !category ? {} : { background: gradientBtn }}>
              {transaction ? '수정하기' : '추가하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
