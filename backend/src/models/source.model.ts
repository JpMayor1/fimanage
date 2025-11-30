import { SourceDocumentType } from "@/types/models/source.type";
import { model, Model, Schema } from "mongoose";

const SourceSchema = new Schema<SourceDocumentType>(
  {
    userId: String,
    name: String,
    income: Number,
    expense: Number,
    balance: Number,
  },
  { timestamps: true }
);

const Source: Model<SourceDocumentType> = model<
  SourceDocumentType,
  Model<SourceDocumentType>
>("Source", SourceSchema);

export default Source;
