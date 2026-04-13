import { Transaction } from './types';

export const sampleTransactions: Transaction[] = [
  // 2026년 4월
  { id: 'seed-1',  type: 'income',  amount: 3200000, category: '급여',      description: '4월 월급',         date: '2026-04-01', createdAt: '2026-04-01T09:00:00Z' },
  { id: 'seed-2',  type: 'expense', amount: 85000,   category: '식비',      description: '마트 장보기',       date: '2026-04-02', createdAt: '2026-04-02T11:00:00Z' },
  { id: 'seed-3',  type: 'expense', amount: 12500,   category: '교통',      description: '지하철 충전',       date: '2026-04-03', createdAt: '2026-04-03T08:30:00Z' },
  { id: 'seed-4',  type: 'expense', amount: 34000,   category: '식비',      description: '점심 회식',         date: '2026-04-04', createdAt: '2026-04-04T13:00:00Z' },
  { id: 'seed-5',  type: 'expense', amount: 128000,  category: '쇼핑',      description: '봄 옷 구매',        date: '2026-04-05', createdAt: '2026-04-05T15:00:00Z' },
  { id: 'seed-6',  type: 'income',  amount: 150000,  category: '부업',      description: '프리랜서 작업비',   date: '2026-04-06', createdAt: '2026-04-06T10:00:00Z' },
  { id: 'seed-7',  type: 'expense', amount: 55000,   category: '문화/여가', description: '영화 + 팝콘',       date: '2026-04-07', createdAt: '2026-04-07T18:00:00Z' },
  { id: 'seed-8',  type: 'expense', amount: 980000,  category: '주거',      description: '월세',             date: '2026-04-08', createdAt: '2026-04-08T09:00:00Z' },
  { id: 'seed-9',  type: 'expense', amount: 67000,   category: '공과금',    description: '전기·가스요금',     date: '2026-04-09', createdAt: '2026-04-09T10:00:00Z' },
  { id: 'seed-10', type: 'expense', amount: 55000,   category: '통신',      description: '휴대폰 요금',       date: '2026-04-10', createdAt: '2026-04-10T10:00:00Z' },
  { id: 'seed-11', type: 'expense', amount: 42000,   category: '식비',      description: '치킨·피자 배달',   date: '2026-04-11', createdAt: '2026-04-11T19:30:00Z' },
  { id: 'seed-12', type: 'expense', amount: 25000,   category: '교통',      description: '택시',             date: '2026-04-12', createdAt: '2026-04-12T23:00:00Z' },
  { id: 'seed-13', type: 'income',  amount: 50000,   category: '용돈',      description: '부모님 용돈',       date: '2026-04-13', createdAt: '2026-04-13T12:00:00Z' },
  { id: 'seed-14', type: 'expense', amount: 18000,   category: '식비',      description: '카페 커피',         date: '2026-04-13', createdAt: '2026-04-13T10:00:00Z' },

  // 2026년 3월
  { id: 'seed-15', type: 'income',  amount: 3200000, category: '급여',      description: '3월 월급',         date: '2026-03-01', createdAt: '2026-03-01T09:00:00Z' },
  { id: 'seed-16', type: 'expense', amount: 980000,  category: '주거',      description: '월세',             date: '2026-03-02', createdAt: '2026-03-02T09:00:00Z' },
  { id: 'seed-17', type: 'expense', amount: 92000,   category: '식비',      description: '마트 장보기',       date: '2026-03-05', createdAt: '2026-03-05T11:00:00Z' },
  { id: 'seed-18', type: 'expense', amount: 250000,  category: '의료',      description: '치과 치료',         date: '2026-03-08', createdAt: '2026-03-08T14:00:00Z' },
  { id: 'seed-19', type: 'expense', amount: 55000,   category: '통신',      description: '휴대폰 요금',       date: '2026-03-10', createdAt: '2026-03-10T10:00:00Z' },
  { id: 'seed-20', type: 'income',  amount: 200000,  category: '부업',      description: '블로그 광고 수익',  date: '2026-03-12', createdAt: '2026-03-12T10:00:00Z' },
  { id: 'seed-21', type: 'expense', amount: 180000,  category: '교육',      description: '영어 학원비',       date: '2026-03-15', createdAt: '2026-03-15T09:00:00Z' },
  { id: 'seed-22', type: 'expense', amount: 78000,   category: '문화/여가', description: '콘서트 티켓',       date: '2026-03-18', createdAt: '2026-03-18T10:00:00Z' },
  { id: 'seed-23', type: 'expense', amount: 65000,   category: '공과금',    description: '전기·가스요금',     date: '2026-03-20', createdAt: '2026-03-20T10:00:00Z' },
  { id: 'seed-24', type: 'expense', amount: 210000,  category: '쇼핑',      description: '운동화 구매',       date: '2026-03-22', createdAt: '2026-03-22T15:00:00Z' },
  { id: 'seed-25', type: 'expense', amount: 48000,   category: '식비',      description: '친구 생일 저녁',    date: '2026-03-25', createdAt: '2026-03-25T19:00:00Z' },

  // 2026년 2월
  { id: 'seed-26', type: 'income',  amount: 3200000, category: '급여',      description: '2월 월급',         date: '2026-02-01', createdAt: '2026-02-01T09:00:00Z' },
  { id: 'seed-27', type: 'expense', amount: 980000,  category: '주거',      description: '월세',             date: '2026-02-02', createdAt: '2026-02-02T09:00:00Z' },
  { id: 'seed-28', type: 'income',  amount: 500000,  category: '이자/배당', description: '주식 배당금',       date: '2026-02-05', createdAt: '2026-02-05T10:00:00Z' },
  { id: 'seed-29', type: 'expense', amount: 320000,  category: '쇼핑',      description: '설날 선물 세트',    date: '2026-02-07', createdAt: '2026-02-07T13:00:00Z' },
  { id: 'seed-30', type: 'expense', amount: 55000,   category: '통신',      description: '휴대폰 요금',       date: '2026-02-10', createdAt: '2026-02-10T10:00:00Z' },
  { id: 'seed-31', type: 'expense', amount: 110000,  category: '식비',      description: '설날 음식 재료',    date: '2026-02-12', createdAt: '2026-02-12T11:00:00Z' },
  { id: 'seed-32', type: 'expense', amount: 72000,   category: '공과금',    description: '전기·가스요금',     date: '2026-02-15', createdAt: '2026-02-15T10:00:00Z' },
  { id: 'seed-33', type: 'expense', amount: 45000,   category: '문화/여가', description: '넷플릭스·유튜브',   date: '2026-02-20', createdAt: '2026-02-20T10:00:00Z' },

  // 2026년 1월
  { id: 'seed-34', type: 'income',  amount: 3200000, category: '급여',      description: '1월 월급',         date: '2026-01-02', createdAt: '2026-01-02T09:00:00Z' },
  { id: 'seed-35', type: 'expense', amount: 980000,  category: '주거',      description: '월세',             date: '2026-01-03', createdAt: '2026-01-03T09:00:00Z' },
  { id: 'seed-36', type: 'expense', amount: 450000,  category: '교육',      description: '자격증 시험 접수비', date: '2026-01-05', createdAt: '2026-01-05T10:00:00Z' },
  { id: 'seed-37', type: 'expense', amount: 55000,   category: '통신',      description: '휴대폰 요금',       date: '2026-01-10', createdAt: '2026-01-10T10:00:00Z' },
  { id: 'seed-38', type: 'income',  amount: 100000,  category: '용돈',      description: '새해 용돈',         date: '2026-01-01', createdAt: '2026-01-01T10:00:00Z' },
  { id: 'seed-39', type: 'expense', amount: 88000,   category: '식비',      description: '신년 가족 외식',    date: '2026-01-01', createdAt: '2026-01-01T18:00:00Z' },
  { id: 'seed-40', type: 'expense', amount: 68000,   category: '공과금',    description: '전기·가스요금',     date: '2026-01-15', createdAt: '2026-01-15T10:00:00Z' },

  // 2025년 12월
  { id: 'seed-41', type: 'income',  amount: 3200000, category: '급여',      description: '12월 월급',        date: '2025-12-01', createdAt: '2025-12-01T09:00:00Z' },
  { id: 'seed-42', type: 'income',  amount: 400000,  category: '부업',      description: '연말 보너스',       date: '2025-12-20', createdAt: '2025-12-20T10:00:00Z' },
  { id: 'seed-43', type: 'expense', amount: 980000,  category: '주거',      description: '월세',             date: '2025-12-02', createdAt: '2025-12-02T09:00:00Z' },
  { id: 'seed-44', type: 'expense', amount: 260000,  category: '쇼핑',      description: '크리스마스 선물',   date: '2025-12-24', createdAt: '2025-12-24T14:00:00Z' },
  { id: 'seed-45', type: 'expense', amount: 95000,   category: '식비',      description: '연말 파티 식재료',  date: '2025-12-31', createdAt: '2025-12-31T16:00:00Z' },

  // 2025년 11월
  { id: 'seed-46', type: 'income',  amount: 3200000, category: '급여',      description: '11월 월급',        date: '2025-11-01', createdAt: '2025-11-01T09:00:00Z' },
  { id: 'seed-47', type: 'expense', amount: 980000,  category: '주거',      description: '월세',             date: '2025-11-02', createdAt: '2025-11-02T09:00:00Z' },
  { id: 'seed-48', type: 'expense', amount: 150000,  category: '의료',      description: '건강검진',          date: '2025-11-10', createdAt: '2025-11-10T10:00:00Z' },
  { id: 'seed-49', type: 'expense', amount: 55000,   category: '통신',      description: '휴대폰 요금',       date: '2025-11-10', createdAt: '2025-11-10T10:01:00Z' },
  { id: 'seed-50', type: 'expense', amount: 190000,  category: '문화/여가', description: '가을 여행 숙소',    date: '2025-11-15', createdAt: '2025-11-15T14:00:00Z' },
];
