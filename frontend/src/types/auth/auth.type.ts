export type AccountType = {
  _id: string;
  publicId?: string;
  profilePicture?: string;
  newProfilePicture?: File | null;
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: string;
  email: string;
  username: string;
  password: string;
  address: string;
  recoveryCode?: string;
  createdAt: string;
  updatedAt: string;
};

export type RegisterAccountType = {
  profilePicture?: null | File;
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: string;
  address: string;
  email: string;
  username: string;
  password: string;
};

export type AuthStateType = {
  authUser: AccountType | null;

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
  }: RegisterAccountType) => Promise<boolean>;
  loginAccount: ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => Promise<boolean>;
  logout: () => Promise<void>;

  updateProfile: (profile: Partial<AccountType>) => Promise<boolean>;
};
