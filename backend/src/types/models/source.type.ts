import { Document } from "mongoose";

export type SourceType = {
  _id: string;
  userId: string;
  name: string;
  income: number;
  expense: number;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
};

// and use it in your service:
export type SourceFilterType = Partial<Pick<SourceType, "userId" | "name">>;

export type SourceDocumentType = SourceType & Document;
