import IncomeCategory from "@/models/IncomeCategory.model";
import {
  IncomeCategoryFilterType,
  IncomeCategoryType,
} from "@/types/models/IncomeCategoryType";

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
