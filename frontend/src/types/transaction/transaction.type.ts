export type TransactionType = {
  _id: string;
  userId: string;
  type: "income" | "expense" | "transfer" | "dept" | "receiving";
  income: {
    source: string;
    note: string;
    amount: number;
  };
  expense: {
    source: string;
    note: string;
    amount: number;
  };
  transfer: {
    from: string;
    to: string;
    amount: number;
  };
  dept: {
    source: string;
    note: string;
    amount: number;
  };
  receiving: {
    source: string;
    note: string;
    amount: number;
  };
  createdAt: string;
  updatedAt: string;
};

export type TransactionStoreType = {
  transactions: TransactionType[];

  hasMore: boolean;
  page: number;

  getLoading: boolean;
  loading: boolean;

  getTransactions: (
    append: boolean,
    type?: TransactionType["type"]
  ) => Promise<void>;
  addTransaction: (data: Partial<TransactionType>) => Promise<boolean>;
  updateTransaction: (
    id: string,
    data: Partial<TransactionType>
  ) => Promise<boolean>;
  deleteTransaction: (id: string) => Promise<boolean>;
};


