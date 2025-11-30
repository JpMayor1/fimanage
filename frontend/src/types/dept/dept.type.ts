export type DeptType = {
  _id: string;
  userId: string;
  lender: string;
  amount: number;
  remaining: number;
  dueDate: string;
  interest: number;
  note: string;
  status: "pending" | "paid" | "overdue";
  createdAt: string;
  updatedAt: string;
};

export type DeptStoreType = {
  depts: DeptType[];

  hasMore: boolean;
  page: number;

  getLoading: boolean;
  loading: boolean;

  getDepts: (append: boolean) => Promise<void>;
  addDept: (data: Partial<DeptType>) => Promise<boolean>;
  updateDept: (id: string, data: Partial<DeptType>) => Promise<boolean>;
  deleteDept: (id: string) => Promise<boolean>;
};
