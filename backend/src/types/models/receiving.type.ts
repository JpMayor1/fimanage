import { Document } from "mongoose";

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
  createdAt: Date;
  updatedAt: Date;
};

export type ReceivingFilterType = Partial<Pick<ReceivingType, "borrower">>;

export type ReceivingDocumentType = ReceivingType & Document;
