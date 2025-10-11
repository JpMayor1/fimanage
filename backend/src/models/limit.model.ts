import { LimitDocumentType } from "@/types/models/limit.type";
import { model, Model, Schema } from "mongoose";

const LimitSchema = new Schema<LimitDocumentType>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    limit: {
      type: Number,
      default: 500,
    },
  },
  { timestamps: true }
);

const Limit: Model<LimitDocumentType> = model<
  LimitDocumentType,
  Model<LimitDocumentType>
>("Limit", LimitSchema);

export default Limit;
