export type AccountType = {
  _id: string;
  name: string;
  username: string;
  email: string;
};

export type AuthStateType = {
  authUser: AccountType | null;

  loginLoading: boolean;
  logoutLoading: boolean;

  loginAccount: ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => Promise<boolean>;
  logout: () => Promise<void>;
};
