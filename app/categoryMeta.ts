export const CATEGORY_META: Record<string, { icon: string; color: string; bg: string }> = {
  // 지출
  '식비':      { icon: '🍽️', color: 'text-orange-600', bg: 'bg-orange-100' },
  '교통':      { icon: '🚌', color: 'text-sky-600',    bg: 'bg-sky-100' },
  '쇼핑':      { icon: '🛍️', color: 'text-pink-600',  bg: 'bg-pink-100' },
  '의료':      { icon: '💊', color: 'text-red-600',    bg: 'bg-red-100' },
  '문화/여가': { icon: '🎬', color: 'text-purple-600', bg: 'bg-purple-100' },
  '교육':      { icon: '📚', color: 'text-blue-600',   bg: 'bg-blue-100' },
  '공과금':    { icon: '💡', color: 'text-yellow-600', bg: 'bg-yellow-100' },
  '주거':      { icon: '🏠', color: 'text-teal-600',   bg: 'bg-teal-100' },
  '통신':      { icon: '📱', color: 'text-indigo-600', bg: 'bg-indigo-100' },
  // 수입
  '급여':      { icon: '💰', color: 'text-green-600',  bg: 'bg-green-100' },
  '부업':      { icon: '💼', color: 'text-emerald-600',bg: 'bg-emerald-100' },
  '이자/배당': { icon: '📈', color: 'text-lime-600',   bg: 'bg-lime-100' },
  '용돈':      { icon: '🎁', color: 'text-rose-600',   bg: 'bg-rose-100' },
  '기타':      { icon: '📦', color: 'text-gray-600',   bg: 'bg-gray-100' },
};

export function getCategoryMeta(category: string) {
  return CATEGORY_META[category] ?? { icon: '📦', color: 'text-gray-600', bg: 'bg-gray-100' };
}
