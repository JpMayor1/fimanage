import type { AccountType } from "../account/account.type";

export type AuthStateType = {
  loading: boolean;

  registerccount: ({
    profilePicture,
    firstName,
    middleName,
    lastName,
    suffix,
    email,
    username,
    password,
    address,
  }: Partial<AccountType>) => Promise<boolean>;
  loginAccount: ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => Promise<boolean>;
  logout: () => Promise<boolean>;
};
