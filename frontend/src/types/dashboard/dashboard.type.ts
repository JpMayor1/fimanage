import type { CalendarType } from "../calendar/calendar.type";
import type { ExpenseType } from "../expense/expense.type";
import type { IncomeType } from "../income/income.type";

export type DashboardStoreType = {
  balance: number;
  dailyExpense: CalendarType[];
  totalIncomes: { total: number; recent: IncomeType[] };
  totalExpenses: { total: number; recent: ExpenseType[] };

  getLoading: boolean;
  updateLoading: boolean;

  getDashboardData: () => Promise<number>;
  updateBalance: (balance: number) => Promise<boolean>;
};
