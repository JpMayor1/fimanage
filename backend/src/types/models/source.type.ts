import { Document } from "mongoose";

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
  createdAt: Date;
  updatedAt: Date;
};

export type SourceFilterType = Partial<Pick<SourceType, "userId" | "name">>;

export type SourceDocumentType = SourceType & Document;
