import { Document } from "mongoose";

export type IncomeType = {
  _id: string;
  icon: string;
  description: string;
  category: string;
  amount: number;
  dt: string;
};

export type IncomeFilterType = Partial<
  Pick<IncomeType, "description" | "category">
>;

export type IncomeDocumentType = IncomeType & Document;
