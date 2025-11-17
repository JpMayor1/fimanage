import type { CalendarType } from "../calendar/calendar.type";
import type { ExpenseType } from "../expense/expense.type";
import type { IncomeType } from "../income/income.type";
import type { InvestmentType } from "../investment/investment.type";
import type { SavingType } from "../saving/saving.type";

export type DashboardStoreType = {
  balance: number;
  dailyExpense: CalendarType[];
  totalIncomes: { total: number; recent: IncomeType[] };
  totalExpenses: { total: number; recent: ExpenseType[] };
  totalSavings: { total: number; recent: SavingType[] };
  totalInvestments: { total: number; recent: InvestmentType[] };

  getLoading: boolean;
  updateLoading: boolean;

  getDashboardData: () => Promise<void>;
  updateBalance: (balance: number) => Promise<boolean>;
};
