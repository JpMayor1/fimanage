import type { CalendarType } from "../calendar/calendar.type";

export type DashboardSummary = {
  totalIncome: number;
  totalExpense: number;
  totalBalance: number;
  totalDeptRemaining: number;
  totalReceivingRemaining: number;
  overdueDepts: number;
  overdueReceivings: number;
  todayExpense: number;
  todayLimit: number;
};

export type DashboardStatistics = {
  totalIncome30Days: number;
  totalExpense30Days: number;
  transactionCount: number;
};

export type ExpenseTrendItem = {
  date: string;
  expense: number;
  limit: number;
};

export type TransactionTypeDistribution = {
  type: "income" | "expense" | "transfer" | "dept" | "receiving";
  count: number;
};

export type TopSource = {
  _id: string;
  name: string;
  balance: number;
  income: number;
  expense: number;
};

export type RecentTransaction = {
  _id: string;
  type: "income" | "expense" | "transfer" | "dept" | "receiving";
  amount: number;
  note: string;
  createdAt: Date | string;
};

export type DashboardStoreType = {
  dailyExpense: CalendarType[];
  summary: DashboardSummary | null;
  statistics: DashboardStatistics | null;
  expenseTrend: ExpenseTrendItem[];
  transactionTypeDistribution: TransactionTypeDistribution[];
  topSources: TopSource[];
  recentTransactions: RecentTransaction[];

  getLoading: boolean;
  updateLoading: boolean;

  getDashboardData: () => Promise<void>;
};
