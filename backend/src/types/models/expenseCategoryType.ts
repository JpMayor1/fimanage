import { Schema } from "mongoose";

export type ExpenseCategoryType = {
  _id: string;
  userId: Schema.Types.ObjectId;
  icon: string;
  name: string;
};

export type ExpenseCategoryFilterType = Partial<
  Pick<ExpenseCategoryType, "_id" | "name" | "userId">
>;

export type ExpenseCategoryDocumentType = ExpenseCategoryType & Document;
