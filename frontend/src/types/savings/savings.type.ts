export type SavingCategoryType = {
  _id?: string;
  name: string;
};

export type SavingType = {
  _id?: string;
  category: string;
  description: string;
  amount: number;
  dt: string;
};

export type SavingStoreType = {
  categories: SavingCategoryType[];
  savings: SavingType[];

  getLoading: boolean;
  createLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;

  // Saving Category
  getCategories: () => Promise<void>;
  createCategories: (categories: SavingCategoryType[]) => Promise<boolean>;
  updateCategory: (
    categoryId: string,
    updatedCategory: SavingCategoryType
  ) => Promise<boolean>;
  deleteCategory: (categoryId: string) => Promise<boolean>;

  // Saving
  getSavings: () => Promise<void>;
  addSaving: (data: Partial<SavingType>) => Promise<boolean>;
  updateSaving: (id: string, data: Partial<SavingType>) => Promise<boolean>;
  deleteSaving: (id: string) => Promise<boolean>;
};
