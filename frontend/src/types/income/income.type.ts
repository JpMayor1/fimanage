import type { IncomeIconKey } from "@/assets/icons/incomeIcons";

export type IncomeCategoryType = {
  _id?: string;
  icon: string;
  name: string;
};

export type IncomeType = {
  _id?: string;
  icon: IncomeIconKey;
  description: string;
  category: string;
  amount: number;
  dt: string;
};

export type incomeStoreType = {
  categories: IncomeCategoryType[];
  incomes: IncomeType[];

  getLoading: boolean;
  createLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;

  // Income Category
  getCategories: () => Promise<void>;
  createCategories: (categories: IncomeCategoryType[]) => Promise<boolean>;
  updateCategory: (
    categoryId: string,
    updatedCategory: IncomeCategoryType
  ) => Promise<boolean>;
  deleteCategory: (categoryId: string) => Promise<boolean>;

  // Income
  getIncomes: () => Promise<void>;
  addIncome: (data: Partial<IncomeType>) => Promise<boolean>;
};
