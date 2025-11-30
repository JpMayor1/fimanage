import { Document } from "mongoose";

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
  createdAt: Date;
  updatedAt: Date;
};

// and use it in your service:
export type DeptFilterType = Partial<Pick<DeptType, "lender">>;

export type DeptDocumentType = DeptType & Document;
