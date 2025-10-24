import Income from "@/models/income.model";
import IncomeCategory from "@/models/incomeCategory.model";
import { AccountDocumentType } from "@/types/models/account.type";
import { IncomeType } from "@/types/models/income.type";
import {
  IncomeCategoryFilterType,
  IncomeCategoryType,
} from "@/types/models/IncomeCategoryType";
import { getPhDt } from "@/utils/date&time/getPhDt";
import { AppError } from "@/utils/error/appError";

// Income Category
export const findIncomeCategoryS = async (
  filter: IncomeCategoryFilterType
): Promise<IncomeCategoryType | null> => {
  try {
    const incomeCategory = await IncomeCategory.findOne(filter).exec();
    return incomeCategory as IncomeCategoryType | null;
  } catch (err) {
    console.error("Error finding income category:", err);
    return null;
  }
};

export const getCategoriesS = async (userId: string) =>
  await IncomeCategory.find({ userId }).lean();

export const createIncomeCategoryS = async (
  categories: IncomeCategoryType[]
) => {
  const newCategories = await IncomeCategory.insertMany(categories);
  return newCategories as IncomeCategoryType[];
};

export const updateCategoryS = async (
  categoryId: string,
  updateData: { name?: string; icon?: string }
) => {
  return await IncomeCategory.findByIdAndUpdate(
    categoryId,
    { $set: updateData },
    { new: true }
  );
};

export const deleteCategoryS = async (categoryId: string) =>
  await IncomeCategory.findByIdAndDelete(categoryId);

// Income
export const getIncomesS = async (userId: string) =>
  await Income.find({ userId }).lean();

export const addIncomeS = async (
  account: AccountDocumentType,
  data: Partial<IncomeType>
) => {
  const category = await IncomeCategory.findOne({ name: data.category });
  if (!category) throw new AppError("Category not found", 404);

  const newIncome = await Income.create({
    ...data,
    icon: category.icon,
    dt: getPhDt(),
  });

  if (data.amount && data.amount > 0) {
    account.balance += Number(data.amount);
    await account.save();
  }

  return newIncome;
};

export const updateIncomeS = async (
  account: AccountDocumentType,
  id: string,
  data: Partial<IncomeType>
) => {
  const income = await Income.findById(id);
  if (!income) throw new AppError("Income not found", 404);

  if (data.category) {
    const category = await IncomeCategory.findOne({ name: data.category });
    if (!category) throw new AppError("Category not found", 404);
    data.icon = category.icon;
  }

  if (data.amount !== undefined) {
    const oldAmount = income.amount;
    const newAmount = data.amount;
    const difference = newAmount - oldAmount;
    account.balance += difference;
    await account.save();
  }

  const updatedIncome = await Income.findByIdAndUpdate(
    id,
    { ...data, dt: getPhDt() },
    { new: true }
  ).lean();

  return updatedIncome;
};

export const deleteIncomeS = async (
  account: AccountDocumentType,
  id: string
) => {
  const deletedIncome = await Income.findByIdAndDelete(id);
  if (!deletedIncome) throw new AppError("Income not found", 404);

  account.balance -= deletedIncome.amount;
  await account.save();

  return deletedIncome;
};
