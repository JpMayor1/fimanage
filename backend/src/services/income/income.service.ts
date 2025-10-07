import Income from "@/models/income.model";
import IncomeCategory from "@/models/incomeCategory.model";
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

export const getCategoriesS = async () => await IncomeCategory.find().lean();

export const createIncomeCategoryS = async (
  categories: { name: string; icon: string }[]
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
export const getIncomesS = async () => await Income.find().lean();

export const addincomeS = async (data: Partial<IncomeType>) => {
  const category = await IncomeCategory.findOne({ name: data.category });
  if (!category) throw new AppError("Category not found", 404);
  const newIncome = await Income.create({
    ...data,
    icon: category.icon,
    dt: getPhDt(),
  });
  return newIncome;
};

export const updateIncomeS = async (id: string, data: Partial<IncomeType>) => {
  const income = await Income.findById(id);
  if (!income) throw new AppError("Income not found", 404);

  if (data.category) {
    const category = await IncomeCategory.findOne({ name: data.category });
    if (!category) throw new AppError("Category not found", 404);
    data.icon = category.icon;
  }

  const updatedIncome = await Income.findByIdAndUpdate(
    id,
    { ...data, dt: getPhDt() },
    { new: true }
  ).lean();

  return updatedIncome;
};

export const deleteIncomeS = async (id: string) => {
  const deletedIncome = await Income.findByIdAndDelete(id);
  if (!deletedIncome) throw new AppError("Income not found", 404);
  return deletedIncome;
};
