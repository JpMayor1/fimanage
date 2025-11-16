import type { SavingIconKey } from "@/assets/icons/savingIcons";

export type SavingType = {
  _id?: string;
  icon: SavingIconKey;
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

export type SavingStoreType = {
  savings: SavingType[];

  hasMore: boolean;
  page: number;

  getLoading: boolean;
  createLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;

  getSavings: (append: boolean) => Promise<void>;
  addSaving: (data: Partial<SavingType>) => Promise<boolean>;
  updateSaving: (id: string, data: Partial<SavingType>) => Promise<boolean>;
  deleteSaving: (id: string) => Promise<boolean>;
};
