export type InvestmentCategoryType = {
  _id?: string;
  name: string;
};

export type InvestmentType = {
  _id?: string;
  category: string;
  description: string;
  amount: number;
  annualRate?: string;
  frequency?:
    | "Daily"
    | "Weekly"
    | "Biweekly"
    | "Semimonthly"
    | "Monthly"
    | "Bimonthly"
    | "Quarterly"
    | "Semiannual"
    | "Annual"
    | "Biennial"
    | "On Maturity"
    | string;
  dt: string;
  createdAt: string;
};

export type InvestmentStoreType = {
  categories: InvestmentCategoryType[];
  investments: InvestmentType[];

  hasMore: boolean;
  page: number;

  getLoading: boolean;
  createLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;

  // Investment Category
  getCategories: () => Promise<void>;
  createCategories: (categories: InvestmentCategoryType[]) => Promise<boolean>;
  updateCategory: (
    categoryId: string,
    updatedCategory: InvestmentCategoryType
  ) => Promise<boolean>;
  deleteCategory: (categoryId: string) => Promise<boolean>;

  // Investment
  getInvestments: (append: boolean) => Promise<void>;
  addInvestment: (data: Partial<InvestmentType>) => Promise<boolean>;
  updateInvestment: (
    id: string,
    data: Partial<InvestmentType>
  ) => Promise<boolean>;
  deleteInvestment: (id: string) => Promise<boolean>;
};
