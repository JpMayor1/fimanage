export type ReportPeriod = "week" | "month" | "year";

export type ReportDateRange = {
  start: string;
  end: string;
};

export type ReportAccount = {
  name: string;
  email: string;
  limit: number;
};

export type ReportSummary = {
  totalIncome: number;
  totalExpense: number;
  totalBalance: number;
  totalDeptRemaining: number;
  totalReceivingRemaining: number;
  periodIncome: number;
  periodExpense: number;
  netFlow: number;
};

export type TransactionBreakdown = {
  income: number;
  expense: number;
  transfer: number;
  dept: number;
  receiving: number;
};

export type OverdueDept = {
  lender: string;
  amount: number;
  remaining: number;
  dueDate: string;
};

export type OverdueReceiving = {
  borrower: string;
  amount: number;
  remaining: number;
  dueDate: string;
};

export type SourceExpense = {
  name: string;
  expense: number;
  income: number;
  balance: number;
};

export type DailyExpenseSummary = {
  date: string;
  expense: number;
  limit: number;
  percentage: number;
};

export type MonthlySummary = {
  month: string;
  income: number;
  expense: number;
};

export type ReportData = {
  period: ReportPeriod;
  dateRange: ReportDateRange;
  account: ReportAccount;
  summary: ReportSummary;
  transactionBreakdown: TransactionBreakdown;
  overdueDepts: OverdueDept[];
  overdueReceivings: OverdueReceiving[];
  sourceExpenses: SourceExpense[];
  dailyExpenseSummary: DailyExpenseSummary[];
  monthlySummary: MonthlySummary[];
  totalTransactions: number;
};

export type ReportStoreType = {
  reportData: ReportData | null;
  getLoading: boolean;
  period: ReportPeriod;
  setPeriod: (period: ReportPeriod) => void;
  getReportData: () => Promise<void>;
};

