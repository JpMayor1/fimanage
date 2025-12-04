export type SourceType = {
  _id: string;
  userId: string;
  name: string;
  income: number;
  expense: number;
  balance: number;
  transactions: {
    transactionId: string;
    type: "income" | "expense" | "transfer" | "dept" | "receiving";
    note: string;
    amount: number;
  }[];
  createdAt: string;
  updatedAt: string;
};

export type SourceStoreType = {
  sources: SourceType[];

  hasMore: boolean;
  page: number;

  getLoading: boolean;
  loading: boolean;

  getSources: (append: boolean) => Promise<void>;
  addSource: (data: Partial<SourceType>) => Promise<boolean>;
  updateSource: (id: string, data: Partial<SourceType>) => Promise<boolean>;
  deleteSource: (id: string) => Promise<boolean>;
};
