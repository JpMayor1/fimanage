import { ExpenseCategoryDocumentType } from "@/types/models/expenseCategoryType";
import { model, Model, Schema } from "mongoose";

const ExpenseCategorySchema = new Schema<ExpenseCategoryDocumentType>(
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

const ExpenseCategory: Model<ExpenseCategoryDocumentType> = model<
  ExpenseCategoryDocumentType,
  Model<ExpenseCategoryDocumentType>
>("ExpenseCategory", ExpenseCategorySchema);

export default ExpenseCategory;
