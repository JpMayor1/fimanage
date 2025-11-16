export type InvestmentType = {
  _id?: string;
  name: string;
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
  investments: InvestmentType[];

  hasMore: boolean;
  page: number;

  getLoading: boolean;
  createLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;

  getInvestments: (append: boolean) => Promise<void>;
  addInvestment: (data: Partial<InvestmentType>) => Promise<boolean>;
  updateInvestment: (
    id: string,
    data: Partial<InvestmentType>
  ) => Promise<boolean>;
  deleteInvestment: (id: string) => Promise<boolean>;
};
