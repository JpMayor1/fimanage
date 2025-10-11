import { Schema } from "mongoose";

export type IncomeCategoryType = {
  _id: string;
  userId: Schema.Types.ObjectId;
  icon: string;
  name: string;
};

export type IncomeCategoryFilterType = Partial<
  Pick<IncomeCategoryType, "_id" | "name" | "userId">
>;

export type IncomeCategoryDocumentType = IncomeCategoryType & Document;
