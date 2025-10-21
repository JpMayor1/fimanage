import Account from "@/models/account.model";
import { AccountType } from "@/types/models/account.type";

export const updateProfileS = async (profile: Partial<AccountType>) =>
  await Account.findByIdAndUpdate(profile._id, profile, { new: true });
