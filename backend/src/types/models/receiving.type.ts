import { Document } from "mongoose";

export type ReceivingType = {
  _id: string;
  userId: string;
  borrower: string;
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

export type ReceivingFilterType = Partial<Pick<ReceivingType, "borrower">>;

export type ReceivingDocumentType = ReceivingType & Document;
