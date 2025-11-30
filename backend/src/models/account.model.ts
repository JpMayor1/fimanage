import { AccountDocumentType } from "@/types/models/account.type";
import { model, Model, Schema } from "mongoose";

const accountSchema = new Schema<AccountDocumentType>(
  {
    publicId: String,
    profilePicture: String,
    firstName: { type: String, required: true },
    middleName: String,
    lastName: { type: String, required: true },
    suffix: String,
    address: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    limit: { type: Number, default: 500 },
    recoveryCode: String,
  },
  { timestamps: true }
);

const Account: Model<AccountDocumentType> = model<
  AccountDocumentType,
  Model<AccountDocumentType>
>("Account", accountSchema);

export default Account;
