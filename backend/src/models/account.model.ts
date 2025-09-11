import { AccountDocumentType } from "@/types/models/account.type";
import { model, Model, Schema } from "mongoose";

const accountSchema = new Schema<AccountDocumentType>(
  {
    profilePicture: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: String,
    recoveryCode: String,
  },
  { timestamps: true }
);

const Account: Model<AccountDocumentType> = model<
  AccountDocumentType,
  Model<AccountDocumentType>
>("Account", accountSchema);

export default Account;
