import Saving from "@/models/saving.model";
import { AccountDocumentType } from "@/types/models/account.type";
import { SavingType } from "@/types/models/saving.type";
import { getPhDt } from "@/utils/date&time/getPhDt";
import { AppError } from "@/utils/error/appError";

export const getSavingsS = async (
  userId: string,
  skip: number,
  limit: number
) => {
  const total = await Saving.countDocuments({ userId });
  const savings = await Saving.find({ userId })
    .sort({ createdAt: -1 })
    .skip(Number(skip))
    .limit(Number(limit))
    .lean();

  return { savings, total };
};

export const addSavingS = async (
  account: AccountDocumentType,
  data: Partial<SavingType>
) => {
  const newSaving = await Saving.create({
    ...data,
    dt: getPhDt(),
  });

  if (data.amount && data.amount > 0) {
    account.balance += Number(data.amount);
    await account.save();
  }
  return newSaving;
};

export const updateSavingS = async (
  account: AccountDocumentType,
  id: string,
  data: Partial<SavingType>
) => {
  const saving = await Saving.findById(id);
  if (!saving) throw new AppError("Saving not found", 404);

  if (saving.userId.toString() !== account._id.toString()) {
    throw new AppError("Unauthorized saving update", 403);
  }

  if (data.amount !== undefined) {
    const oldAmount = saving.amount;
    const newAmount = data.amount;
    const diff = Number(newAmount) - Number(oldAmount);

    if (diff !== 0) {
      account.balance += diff;
      await account.save();
    }
  }

  Object.assign(saving, data, { dt: getPhDt() });
  await saving.save();

  return saving.toObject();
};

export const deleteSavingS = async (id: string) => {
  const deletedSaving = await Saving.findByIdAndDelete(id);
  if (!deletedSaving) throw new AppError("Saving not found", 404);
  return deletedSaving;
};
