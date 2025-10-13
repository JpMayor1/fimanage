import SavingCategory from "@/models/savingsCategory.model";
import {
  SavingCategoryFilterType,
  SavingCategoryType,
} from "@/types/models/savingsCategory.type";

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
