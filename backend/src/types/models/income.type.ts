import { Document, Schema } from "mongoose";

export type IncomeType = {
  _id?: string;
  userId: Schema.Types.ObjectId;
  icon: string;
  category: string;
  description: string;
  amount: number;
  dt: string;
};

export type IncomeFilterType = Partial<
  Pick<IncomeType, "description" | "category">
>;

export type IncomeDocumentType = IncomeType & Document;
