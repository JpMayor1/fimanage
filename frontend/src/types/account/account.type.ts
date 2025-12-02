export type AccountType = {
  _id: string;
  publicId?: string;
  profilePicture?: string | File | null;
  newProfilePicture?: File | null;
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: string;
  email: string;
  username: string;
  password: string;
  address: string;
  limit?: number;
  recoveryCode?: string;
  createdAt: string;
  updatedAt: string;
};

export type AccountStoreType = {
  account: AccountType | null;
  loading: boolean;
  verify: () => Promise<boolean>;
  updateProfile: (profile: Partial<AccountType>) => Promise<boolean>;
};
