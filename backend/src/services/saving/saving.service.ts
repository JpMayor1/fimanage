import Saving from "@/models/saving.model";
import SavingCategory from "@/models/savingCategory.model";
import { AccountDocumentType } from "@/types/models/account.type";
import { SavingType } from "@/types/models/saving.type";
import {
  SavingCategoryFilterType,
  SavingCategoryType,
} from "@/types/models/savingCategory.type";
import { getPhDt } from "@/utils/date&time/getPhDt";
import { AppError } from "@/utils/error/appError";

// Saving Category
export const findSavingCategoryS = async (
  filter: SavingCategoryFilterType
): Promise<SavingCategoryType | null> => {
  try {
    const savingCategory = await SavingCategory.findOne(filter).exec();
    return savingCategory as SavingCategoryType | null;
  } catch (err) {
    console.error("Error finding saving category:", err);
    return null;
  }
};

export const getCategoriesS = async (userId: string) =>
  await SavingCategory.find({ userId }).lean();

export const createSavingCategoryS = async (
  categories: SavingCategoryType[]
) => {
  const newCategories = await SavingCategory.insertMany(categories);
  return newCategories as SavingCategoryType[];
};

export const updateCategoryS = async (
  categoryId: string,
  updateData: { name?: string }
) => {
  return await SavingCategory.findByIdAndUpdate(
    categoryId,
    { $set: updateData },
    { new: true }
  );
};

export const deleteCategoryS = async (categoryId: string) =>
  await SavingCategory.findByIdAndDelete(categoryId);

// Saving
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
  const category = await SavingCategory.findOne({ name: data.category });
  if (!category) throw new AppError("Category not found", 404);
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

  if (data.category) {
    const category = await SavingCategory.findOne({ name: data.category });
    if (!category) throw new AppError("Category not found", 404);
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
