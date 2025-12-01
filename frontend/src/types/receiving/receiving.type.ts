export type ReceivingType = {
  _id: string;
  userId: string;
  borrower: string;
  amount: number;
  remaining: number;
  dueDate: string;
  interest: number;
  note: string;
  status: "pending" | "paid" | "overdue";
  createdAt: string;
  updatedAt: string;
};

export type ReceivingStoreType = {
  receivings: ReceivingType[];

  hasMore: boolean;
  page: number;

  getLoading: boolean;
  loading: boolean;

  getReceivings: (append: boolean) => Promise<void>;
  addReceiving: (data: Partial<ReceivingType>) => Promise<boolean>;
  updateReceiving: (
    id: string,
    data: Partial<ReceivingType>
  ) => Promise<boolean>;
  deleteReceiving: (id: string) => Promise<boolean>;
};
