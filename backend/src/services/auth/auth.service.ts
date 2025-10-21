import Account from "@/models/account.model";
import {
  AccountFilterType,
  AccountType,
  RegisterAccountType,
} from "@/types/models/account.type";

export const findAccountS = async (
  filter: AccountFilterType
): Promise<AccountType | null> => {
  try {
    const account = await Account.findOne(filter).exec();
    return account as AccountType | null;
  } catch (err) {
    console.error("Error finding account:", err);
    return null;
  }
};

export const registerAccountS = async ({
  publicId,
  profilePicture,
  firstName,
  middleName,
  lastName,
  suffix,
  address,
  email,
  username,
  password,
}: RegisterAccountType) => {
  const account = await Account.create({
    profilePicture,
    firstName,
    middleName,
    lastName,
    suffix,
    address,
    email,
    username,
    password,
  });
  return account;
};
