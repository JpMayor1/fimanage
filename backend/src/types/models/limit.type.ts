import { Document, Schema } from "mongoose";

export type LimitType = {
  _id?: string;
  userId: Schema.Types.ObjectId;
  limit: number;
};

export type LimitFilterType = Partial<Pick<LimitType, "_id" | "userId">>;

export type LimitDocumentType = LimitType & Document;
