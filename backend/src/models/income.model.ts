import { IncomeDocumentType } from "@/types/models/income.type";
import { model, Model, Schema } from "mongoose";

const incomeSchema = new Schema<IncomeDocumentType>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    icon: String,
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    amount: { type: Number, required: true },
    dt: String,
  },
  { timestamps: true }
);

const Income: Model<IncomeDocumentType> = model<
  IncomeDocumentType,
  Model<IncomeDocumentType>
>("Income", incomeSchema);

export default Income;
