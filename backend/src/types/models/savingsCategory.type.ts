import { Schema } from "mongoose";

export type SavingCategoryType = {
  _id: string;
  userId: Schema.Types.ObjectId;
  name: string;
};

export type SavingCategoryFilterType = Partial<
  Pick<SavingCategoryType, "_id" | "name" | "userId">
>;

export type SavingCategoryDocumentType = SavingCategoryType & Document;
