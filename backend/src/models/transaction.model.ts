import { transactionDocumentType } from "@/types/models/transaction.type";
import { model, Model, Schema } from "mongoose";

const TransactionSchema = new Schema<transactionDocumentType>(
  {
    userId: { type: String, required: true },
    type: {
      type: String,
      enum: ["income", "expense", "transfer", "dept", "receiving"],
      required: true,
    },
    income: {
      source: String,
      note: String,
      amount: Number,
    },
    expense: {
      source: String,
      note: String,
      amount: Number,
    },
    transfer: {
      from: String,
      to: String,
      amount: Number,
    },
    dept: {
      source: String, // Dept ID
      moneySource: String, // Money source ID
      note: String,
      amount: Number,
    },
    receiving: {
      source: String, // Receiving ID
      moneySource: String, // Money source ID
      note: String,
      amount: Number,
    },
  },
  { timestamps: true }
);

const Transaction: Model<transactionDocumentType> = model<
  transactionDocumentType,
  Model<transactionDocumentType>
>("Transaction", TransactionSchema);

export default Transaction;



