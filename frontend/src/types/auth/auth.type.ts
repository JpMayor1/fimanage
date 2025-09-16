export type AccountType = {
  _id: string;
  name: string;
  email: string;
  username: string;
  password: string;
  address: string;
  recoveryCode?: string;
  createdAt: string;
  updatedAt: string;
};

export type RegisterAccountType = {
  name: string;
  email: string;
  username: string;
  password: string;
  address: string;
};

export type AuthStateType = {
  authUser: AccountType | null;

  registerLoading: boolean;
  loginLoading: boolean;
  logoutLoading: boolean;

  registerccount: ({
    name,
    email,
    username,
    password,
    address,
  }: RegisterAccountType) => Promise<boolean>;
  loginAccount: ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => Promise<boolean>;
  logout: () => Promise<void>;
};
