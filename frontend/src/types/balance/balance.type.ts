import type { BalanceIconKey } from "@/assets/icons/balanceIcons";

export type BalanceType = {
  _id?: string;
  userId: string;
  icon: BalanceIconKey;
  showIcons: boolean;
  name: string;
  amount: number;
  dt: string;
  createdAt: string;
};

export type BalanceStoreType = {
  balances: BalanceType[];

  getLoading: boolean;
  createLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;

  getBalances: () => Promise<void>;
  addBalance: (data: Partial<BalanceType>) => Promise<boolean>;
  updateBalance: (id: string, data: Partial<BalanceType>) => Promise<boolean>;
  deleteBalance: (id: string) => Promise<boolean>;
};
