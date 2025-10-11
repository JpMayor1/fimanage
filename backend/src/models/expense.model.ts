import { ExpenseDocumentType } from "@/types/models/expense.type";
import { model, Model, Schema } from "mongoose";

const ExpenseSchema = new Schema<ExpenseDocumentType>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    icon: String,
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    amount: { type: Number, required: true },
    dt: String,
  },
  { timestamps: true }
);

const Expense: Model<ExpenseDocumentType> = model<
  ExpenseDocumentType,
  Model<ExpenseDocumentType>
>("Expense", ExpenseSchema);

export default Expense;
