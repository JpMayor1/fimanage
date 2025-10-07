import ExpenseCategory from "@/models/expenseCategory.model";
import {
  ExpenseCategoryFilterType,
  ExpenseCategoryType,
} from "@/types/models/expenseCategoryType";

// Expense Category
export const findExpenseCategoryS = async (
  filter: ExpenseCategoryFilterType
): Promise<ExpenseCategoryType | null> => {
  try {
    const incomeCategory = await ExpenseCategory.findOne(filter).exec();
    return incomeCategory as ExpenseCategoryType | null;
  } catch (err) {
    console.error("Error finding income category:", err);
    return null;
  }
};

export const getCategoriesS = async () => await ExpenseCategory.find().lean();

export const createExpenseCategoryS = async (
  categories: { name: string; icon: string }[]
) => {
  const newCategories = await ExpenseCategory.insertMany(categories);
  return newCategories as ExpenseCategoryType[];
};

export const updateCategoryS = async (
  categoryId: string,
  updateData: { name?: string; icon?: string }
) => {
  return await ExpenseCategory.findByIdAndUpdate(
    categoryId,
    { $set: updateData },
    { new: true }
  );
};

export const deleteCategoryS = async (categoryId: string) =>
  await ExpenseCategory.findByIdAndDelete(categoryId);
