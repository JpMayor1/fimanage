import type { BalanceType } from "../balance/balance.type";
import type { CalendarType } from "../calendar/calendar.type";
import type { ExpenseType } from "../expense/expense.type";
import type { IncomeType } from "../income/income.type";

export type DashboardStoreType = {
  dailyExpense: CalendarType[];
  totalBalances: { total: number; recent: BalanceType[] };
  totalIncomes: { total: number; recent: IncomeType[] };
  totalExpenses: { total: number; recent: ExpenseType[] };

  getLoading: boolean;

  getDashboardData: () => Promise<void>;
};
