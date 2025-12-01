import { Document } from "mongoose";

export type CalendarType = {
  _id: string;
  userId: string;
  limit: number;
  expense: number;
  date: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CalendarFilterType = Partial<
  Pick<CalendarType, "userId" | "limit" | "expense">
>;

export type CalendarDocumentType = CalendarType & Document;
