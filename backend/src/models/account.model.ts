import { AccountDocumentType } from "@/types/models/account.type";
import { model, Model, Schema } from "mongoose";

const accountSchema = new Schema<AccountDocumentType>(
  {
    profilePicture: String,
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String, required: true },
    recoveryCode: String,
  },
  { timestamps: true }
);

const Account: Model<AccountDocumentType> = model<
  AccountDocumentType,
  Model<AccountDocumentType>
>("Account", accountSchema);

export default Account;
