import { InvestmentDocumentType } from "@/types/models/investment.type";
import { model, Model, Schema } from "mongoose";

const savingSchema = new Schema<InvestmentDocumentType>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    amount: { type: Number, required: true },
    annualRate: String,
    frequency: String,
    dt: String,
  },
  { timestamps: true }
);

const Investment: Model<InvestmentDocumentType> = model<
  InvestmentDocumentType,
  Model<InvestmentDocumentType>
>("Investment", savingSchema);

export default Investment;
