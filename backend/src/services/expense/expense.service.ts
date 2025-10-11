import Expense from "@/models/expense.model";
import ExpenseCategory from "@/models/expenseCategory.model";
import Limit from "@/models/limit.model";
import { ExpenseType } from "@/types/models/expense.type";
import {
  ExpenseCategoryFilterType,
  ExpenseCategoryType,
} from "@/types/models/expenseCategoryType";
import { getPhDt } from "@/utils/date&time/getPhDt";
import { AppError } from "@/utils/error/appError";

// Expense Category
export const findExpenseCategoryS = async (
  filter: ExpenseCategoryFilterType
): Promise<ExpenseCategoryType | null> => {
  try {
    const expenseCategory = await ExpenseCategory.findOne(filter).exec();
    return expenseCategory as ExpenseCategoryType | null;
  } catch (err) {
    console.error("Error finding expense category:", err);
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

// Expense
export const getExpensesS = async (userId: string) => {
  const expenses = await Expense.find().lean();
  const limit = await Limit.find({ _id: userId }).lean();
  return { expenses, limit };
};

export const addExpenseS = async (data: Partial<ExpenseType>) => {
  const category = await ExpenseCategory.findOne({ name: data.category });
  if (!category) throw new AppError("Category not found", 404);
  const newExpense = await Expense.create({
    ...data,
    icon: category.icon,
    dt: getPhDt(),
  });
  return newExpense;
};

export const updateExpenseS = async (
  id: string,
  data: Partial<ExpenseType>
) => {
  const expense = await Expense.findById(id);
  if (!expense) throw new AppError("Expense not found", 404);

  if (data.category) {
    const category = await ExpenseCategory.findOne({ name: data.category });
    if (!category) throw new AppError("Category not found", 404);
    data.icon = category.icon;
  }

  const updatedExpense = await Expense.findByIdAndUpdate(
    id,
    { ...data, dt: getPhDt() },
    { new: true }
  ).lean();

  return updatedExpense;
};

export const deleteExpenseS = async (id: string) => {
  const deletedExpense = await Expense.findByIdAndDelete(id);
  if (!deletedExpense) throw new AppError("Expense not found", 404);
  return deletedExpense;
};
