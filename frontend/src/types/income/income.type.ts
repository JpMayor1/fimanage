export type IncomeCategoryType = {
  _id: string;
  name: string;
};

export type IncomeType = {
  _id: string;
  icon: string;
  description: string;
  category: string;
  amount: number;
  dt: string;
};

export type incomeStoreType = {
  categories: IncomeCategoryType[];

  getLoading: boolean;
  createLoading: boolean;

  getCategories: () => Promise<void>;
  createCategories: (names: string[]) => Promise<boolean>;
};
