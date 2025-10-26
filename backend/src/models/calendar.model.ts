import { CalendarDocumentType } from "@/types/models/calendar.type";
import { model, Model, Schema } from "mongoose";

const CalendarSchema = new Schema<CalendarDocumentType>(
  {
    userId: String,
    limit: Number,
    expense: Number,
  },
  { timestamps: true }
);

const Calendar: Model<CalendarDocumentType> = model<
  CalendarDocumentType,
  Model<CalendarDocumentType>
>("Calendar", CalendarSchema);

export default Calendar;
