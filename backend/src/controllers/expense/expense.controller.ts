import {
  addExpenseS,
  createExpenseCategoryS,
  deleteCategoryS,
  deleteExpenseS,
  findExpenseCategoryS,
  getCategoriesS,
  getExpensesS,
  updateCategoryS,
  updateExpenseS,
  updateLimitS,
} from "@/services/expense/expense.service";

import { CustomRequest } from "@/types/express/express.type";
import { ExpenseCategoryType } from "@/types/models/expenseCategoryType";
import { AppError } from "@/utils/error/appError";
import { Response } from "express";

// Expense Category
export const getCategories = async (req: CustomRequest, res: Response) => {
  const account = req.account;
  const categories = await getCategoriesS(account._id);
  res.status(200).json({ categories });
};

export const createExpenseCategory = async (
  req: CustomRequest,
  res: Response
) => {
  const account = req.account;
  const { categories } = req.body;

  if (!categories || !Array.isArray(categories) || categories.length === 0) {
    throw new AppError("Categories array (name + icon) is required", 400);
  }

  const processedCategories = [];
  for (const { name, icon } of categories) {
    if (!name || !icon) {
      throw new AppError("Each category must have a name and icon", 400);
    }

    const existing = await findExpenseCategoryS({ name, userId: account._id });
    if (existing) throw new AppError(`Category "${name}" already exists`, 400);

    processedCategories.push({
      name,
      icon,
      userId: account._id,
    });
  }

  const newCategories = await createExpenseCategoryS(
    processedCategories as ExpenseCategoryType[]
  );

  if (!newCategories) {
    throw new AppError("Error creating expense categories", 400);
  }

  res.status(201).json({
    message: "Categories created successfully.",
    newCategories,
  });
};

export const updateCategory = async (req: CustomRequest, res: Response) => {
  const { categoryId, name, icon } = req.body;

  if (!categoryId) throw new AppError("Category ID is required", 400);
  if (!name && !icon) {
    throw new AppError("At least one of name or icon is required", 400);
  }

  const updatedCategory = await updateCategoryS(categoryId, { name, icon });

  if (!updatedCategory) throw new AppError("Error updating category", 400);

  res.status(200).json({
    message: "Category updated successfully.",
    updatedCategory,
  });
};

export const deleteCategory = async (req: CustomRequest, res: Response) => {
  const { categoryId } = req.params;
  const deleted = await deleteCategoryS(categoryId);
  if (!deleted) throw new AppError("Error deleting gategory", 400);
  res.status(200).json({ message: "Category deleted successfully." });
};

// Expense
export const getExpenses = async (req: CustomRequest, res: Response) => {
  const account = req.account;
  const expenses = await getExpensesS(account._id);
  res.status(200).json({ expenses, limit: account.limit });
};

export const addExpense = async (req: CustomRequest, res: Response) => {
  const account = req.account;
  const { description, category, amount } = req.body;
  if (!description) throw new AppError("Description is required.", 400);
  if (!category) throw new AppError("Category is required.", 400);
  if (!Number(amount)) throw new AppError("Amount is required.", 400);

  const newExpense = await addExpenseS({
    userId: account._id,
    description,
    category,
    amount,
  });
  res.status(200).json({ message: "Expense added.", newExpense });
};

export const updateExpense = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;
  const { description, category, amount } = req.body;

  if (!id) throw new AppError("Expense ID is required.", 400);
  if (!description) throw new AppError("Description is required.", 400);
  if (!category) throw new AppError("Category is required.", 400);
  if (!Number(amount)) throw new AppError("Amount is required.", 400);

  const updatedExpense = await updateExpenseS(id, {
    description,
    category,
    amount,
  });

  res
    .status(200)
    .json({ message: "Expense updated successfully.", updatedExpense });
};

export const deleteExpense = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;
  const deletedExpense = await deleteExpenseS(id);
  res.status(200).json({ message: "Expense deleted.", deletedExpense });
};

export const updateLimit = async (req: CustomRequest, res: Response) => {
  const account = req.account;
  const { limit } = req.body;

  const updatedLimit = await updateLimitS(account._id, limit);
  if (!updatedLimit) throw new AppError("Error updating limit", 400);

  res
    .status(200)
    .json({ message: "Limit updated.", limit: updatedLimit.limit });
};
