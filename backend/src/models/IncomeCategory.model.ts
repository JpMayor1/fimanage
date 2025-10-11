import { IncomeCategoryDocumentType } from "@/types/models/IncomeCategoryType";
import { model, Model, Schema } from "mongoose";

const incomeCategorySchema = new Schema<IncomeCategoryDocumentType>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    icon: { type: String, required: true },
    name: { type: String, required: true },
  },
  { timestamps: true }
);

const IncomeCategory: Model<IncomeCategoryDocumentType> = model<
  IncomeCategoryDocumentType,
  Model<IncomeCategoryDocumentType>
>("IncomeCategory", incomeCategorySchema);

export default IncomeCategory;
