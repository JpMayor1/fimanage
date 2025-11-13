import { BalanceDocumentType } from "@/types/models/balance.type";
import { model, Model, Schema } from "mongoose";

const balanceSchema = new Schema<BalanceDocumentType>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    icon: String,
    name: String,
    amount: { type: Number, required: true },
    dt: String,
  },
  { timestamps: true }
);

const Balance: Model<BalanceDocumentType> = model<
  BalanceDocumentType,
  Model<BalanceDocumentType>
>("Balance", balanceSchema);

export default Balance;
