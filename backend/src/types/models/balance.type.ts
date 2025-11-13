import { Document, Schema } from "mongoose";

export type BalanceType = {
  _id?: string;
  userId: Schema.Types.ObjectId;
  icon: string;
  name: string;
  amount: number;
  dt: string;
};

export type BalanceFilterType = Partial<
  Pick<BalanceType, "_id" | "userId" | "name">
>;

export type BalanceDocumentType = BalanceType & Document;
