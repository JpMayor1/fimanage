import { Document, Schema } from "mongoose";

export type IncomeType = {
  _id?: string;
  userId: Schema.Types.ObjectId;
  icon: string;
  name: string;
  description: string;
  amount: number;
  dt: string;
};

export type IncomeFilterType = Partial<
  Pick<IncomeType, "description" | "name">
>;

export type IncomeDocumentType = IncomeType & Document;
