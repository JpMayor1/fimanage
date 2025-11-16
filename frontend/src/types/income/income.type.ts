import type { IncomeIconKey } from "@/assets/icons/incomeIcons";

export type IncomeType = {
  _id?: string;
  icon: IncomeIconKey;
  name: string;
  description: string;
  amount: number;
  dt: string;
  createdAt: string;
};

export type IncomeStoreType = {
  incomes: IncomeType[];

  hasMore: boolean;
  page: number;

  getLoading: boolean;
  loading: boolean;

  getIncomes: (append: boolean) => Promise<void>;
  addIncome: (data: Partial<IncomeType>) => Promise<boolean>;
  updateIncome: (id: string, data: Partial<IncomeType>) => Promise<boolean>;
  deleteIncome: (id: string) => Promise<boolean>;
};
