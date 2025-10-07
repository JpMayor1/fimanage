import { Document } from "mongoose";

export type ExpenseType = {
  _id?: string;
  icon: string;
  description: string;
  category: string;
  amount: number;
  dt: string;
};

export type ExpenseFilterType = Partial<
  Pick<ExpenseType, "description" | "category">
>;

export type ExpenseDocumentType = ExpenseType & Document;
