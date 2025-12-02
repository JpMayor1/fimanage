import { Document } from "mongoose";

export type transactionType = {
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
  createdAt: Date;
  updatedAt: Date;
};

export type transactionFilterType = Partial<
  Pick<transactionType, "userId" | "type">
>;

export type transactionDocumentType = transactionType & Document;
