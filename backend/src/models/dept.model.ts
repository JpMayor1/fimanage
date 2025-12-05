import { DeptDocumentType } from "@/types/models/dept.type";
import { model, Model, Schema } from "mongoose";

const DeptSchema = new Schema<DeptDocumentType>(
  {
    userId: String,
    lender: String,
    source: String,
    remaining: Number,
    dueDate: String,
    interest: Number,
    note: String,
    status: {
      type: String,
      enum: ["pending", "paid", "overdue"],
      default: "pending",
    },
    transactions: [
      {
        transactionId: String,
        note: String,
        amount: Number,
      },
    ],
  },
  { timestamps: true }
);

const Dept: Model<DeptDocumentType> = model<
  DeptDocumentType,
  Model<DeptDocumentType>
>("Dept", DeptSchema);

export default Dept;
