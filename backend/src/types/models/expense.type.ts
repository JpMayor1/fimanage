import { Document, Schema } from "mongoose";

export type ExpenseType = {
  _id?: string;
  userId: Schema.Types.ObjectId;
  icon: string;
  name: string;
  description: string;
  amount: number;
  dt: string;
  countable: boolean;
  savingId: string;
  investmentId: string;
};

export type ExpenseFilterType = Partial<
  Pick<ExpenseType, "description" | "name">
>;

export type ExpenseDocumentType = ExpenseType & Document;
