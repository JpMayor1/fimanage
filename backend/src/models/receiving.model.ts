import { ReceivingDocumentType } from "@/types/models/receiving.type";
import { model, Model, Schema } from "mongoose";

const ReceivingSchema = new Schema<ReceivingDocumentType>(
  {
    userId: String,
    borrower: String,
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

const Receiving: Model<ReceivingDocumentType> = model<
  ReceivingDocumentType,
  Model<ReceivingDocumentType>
>("Receiving", ReceivingSchema);

export default Receiving;
