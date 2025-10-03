export type IncomeCategoryType = {
  _id?: string;
  icon: string;
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
  updateLoading: boolean;
  deleteLoading: boolean;

  getCategories: () => Promise<void>;
  createCategories: (categories: IncomeCategoryType[]) => Promise<boolean>;
  updateCategory: (
    categoryId: string,
    updatedCategory: IncomeCategoryType
  ) => Promise<boolean>;
  deleteCategory: (categoryId: string) => Promise<boolean>;
};
