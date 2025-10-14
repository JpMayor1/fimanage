import { InvestmentCategoryDocumentType } from "@/types/models/investmentCategory.type";
import { model, Model, Schema } from "mongoose";

const savingCategorySchema = new Schema<InvestmentCategoryDocumentType>(
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

const InvestmentCategory: Model<InvestmentCategoryDocumentType> = model<
  InvestmentCategoryDocumentType,
  Model<InvestmentCategoryDocumentType>
>("InvestmentCategory", savingCategorySchema);

export default InvestmentCategory;
