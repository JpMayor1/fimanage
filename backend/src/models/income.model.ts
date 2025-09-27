import { IncomeDocumentType } from "@/types/models/income.type";
import { model, Model, Schema } from "mongoose";

const incomeSchema = new Schema<IncomeDocumentType>(
  {
    icon: String,
    description: String,
    category: {
      type: String,
      required: true,
      enum: ["Salary", "Freelancing", "Gift"],
    },
    amount: { type: Number, required: true },
    dt: String,
  },
  { timestamps: true }
);

const AIncome: Model<IncomeDocumentType> = model<
  IncomeDocumentType,
  Model<IncomeDocumentType>
>("AIncome", incomeSchema);

export default AIncome;
