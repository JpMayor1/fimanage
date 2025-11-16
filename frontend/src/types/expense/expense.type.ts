import type { ExpenseIconKey } from "@/assets/icons/expenseIcons";
import type { InvestmentType } from "../investment/investment.type";
import type { SavingType } from "../saving/saving.type";

export type ExpenseType = {
  _id?: string;
  icon: ExpenseIconKey;
  name: string;
  description: string;
  amount: number;
  dt: string;
  countable: boolean;
  createdAt: string;
  savingId: string;
  investmentId: string;
};

export type ExpenseStoreType = {
  savings: SavingType[];
  investments: InvestmentType[];
  expenses: ExpenseType[];
  limit: number;

  hasMore: boolean;
  page: number;

  getLoading: boolean;
  getSourcesLoading: boolean;
  loading: boolean;

  shown: boolean;

  getExpenses: (append: boolean) => Promise<void>;
  getSources: () => Promise<void>;
  addExpense: (data: Partial<ExpenseType>) => Promise<boolean>;
  updateExpense: (id: string, data: Partial<ExpenseType>) => Promise<boolean>;
  deleteExpense: (id: string) => Promise<boolean>;

  // Limit
  updateLimit: (limit: number) => Promise<boolean>;
  setShown: () => void;
};
