import { Schema } from "mongoose";

export type InvestmentCategoryType = {
  _id: string;
  userId: Schema.Types.ObjectId;
  name: string;
};

export type InvestmentCategoryFilterType = Partial<
  Pick<InvestmentCategoryType, "_id" | "name" | "userId">
>;

export type InvestmentCategoryDocumentType = InvestmentCategoryType & Document;
