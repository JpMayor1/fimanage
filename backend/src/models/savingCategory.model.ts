import { SavingCategoryDocumentType } from "@/types/models/savingCategory.type";
import { model, Model, Schema } from "mongoose";

const savingCategorySchema = new Schema<SavingCategoryDocumentType>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    name: { type: String, required: true },
  },
  { timestamps: true }
);

const SavingCategory: Model<SavingCategoryDocumentType> = model<
  SavingCategoryDocumentType,
  Model<SavingCategoryDocumentType>
>("SavingCategory", savingCategorySchema);

export default SavingCategory;
