import { Document, Schema } from "mongoose";

export type ExpenseType = {
  _id?: string;
  userId: Schema.Types.ObjectId;
  icon: string;
  description: string;
  category: string;
  amount: number;
  dt: string;
  countable: boolean;
};

export type ExpenseFilterType = Partial<
  Pick<ExpenseType, "description" | "category">
>;

export type ExpenseDocumentType = ExpenseType & Document;
