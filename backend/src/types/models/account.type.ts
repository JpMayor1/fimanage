import { Document } from "mongoose";

export type AccountType = {
  _id: string;
  name: string;
  email: string;
  username: string;
  password: string;
  address: string;
  recoveryCode?: string;
  createdAt: Date;
  updatedAt: Date;
};

// and use it in your service:
export type AccountFilterType = Partial<
  Pick<AccountType, "email" | "username">
>;

export type AccountDocumentType = AccountType & Document;

export type RegisterAccountType = {
  name: string;
  email: string;
  username: string;
  password: string;
  address: string;
};
