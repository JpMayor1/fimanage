import { Document } from "mongoose";

export type DeptType = {
  _id: string;
  userId: string;
  lender: string;
  source?: string;
  remaining: number;
  dueDate: string;
  interest: number;
  note: string;
  status: "pending" | "paid" | "overdue";
  transactions: {
    transactionId: string;
    note: string;
    amount: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
};

export type DeptFilterType = Partial<Pick<DeptType, "lender">>;

export type DeptDocumentType = DeptType & Document;
