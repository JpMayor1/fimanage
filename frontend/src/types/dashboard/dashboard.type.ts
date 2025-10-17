import type { ExpenseType } from "../expense/expense.type";
import type { IncomeType } from "../income/income.type";
import type { InvestmentType } from "../investment/investment.type";
import type { SavingType } from "../saving/saving.type";

export type DashboardStoreType = {
  totalIncomes: IncomeType[];
  totalExpenses: ExpenseType[];
  totalSavings: SavingType[];
  totalInvestments: InvestmentType[];

  getLoading: boolean;

  getDashboardData: () => Promise<void>;
};
