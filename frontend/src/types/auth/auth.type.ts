export type AccountType = {
  _id: string;
  profilePicture?: string;
  name: string;
  email: string;
  username: string;
  password: string;
  address: string;
  recoveryCode?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AuthStateType = {
  authUser: AccountType | null;

  registerLoading: boolean;
  loginLoading: boolean;
  logoutLoading: boolean;

  registerccount: ({
    profilePicture,
    name,
    email,
    username,
    password,
    address,
  }: {
    profilePicture: File;
    name: string;
    email: string;
    username: string;
    password: string;
    address: string;
  }) => Promise<boolean>;
  loginAccount: ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => Promise<boolean>;
  logout: () => Promise<void>;
};
