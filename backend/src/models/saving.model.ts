import { SavingDocumentType } from "@/types/models/saving.type";
import { model, Model, Schema } from "mongoose";

const savingSchema = new Schema<SavingDocumentType>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
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

const Saving: Model<SavingDocumentType> = model<
  SavingDocumentType,
  Model<SavingDocumentType>
>("Saving", savingSchema);

export default Saving;
