import type { IncomeIconKey } from "@/assets/icons/incomeIcons";
import type { BalanceType } from "../balance/balance.type";

export type IncomeCategoryType = {
  _id?: string;
  icon: string;
  name: string;
};

export type IncomeType = {
  _id?: string;
  balanceId: string;
  icon: IncomeIconKey;
  category: string;
  description: string;
  amount: number;
  dt: string;
  createdAt: string;
};

export type IncomeStoreType = {
  categories: IncomeCategoryType[];
  balances: BalanceType[];
  incomes: IncomeType[];

  hasMore: boolean;
  page: number;

  getLoading: boolean;
  createLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;

  getSelections: () => Promise<void>;

  // Income Category
  getCategories: () => Promise<void>;
  createCategories: (categories: IncomeCategoryType[]) => Promise<boolean>;
  updateCategory: (
    categoryId: string,
    updatedCategory: IncomeCategoryType
  ) => Promise<boolean>;
  deleteCategory: (categoryId: string) => Promise<boolean>;

  // Income
  getIncomes: (append: boolean) => Promise<void>;
  addIncome: (data: Partial<IncomeType>) => Promise<boolean>;
  updateIncome: (id: string, data: Partial<IncomeType>) => Promise<boolean>;
  deleteIncome: (id: string) => Promise<boolean>;
};
