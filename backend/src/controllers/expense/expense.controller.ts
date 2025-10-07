import {
  createExpenseCategoryS,
  deleteCategoryS,
  findExpenseCategoryS,
  getCategoriesS,
  updateCategoryS,
} from "@/services/expense/expense.service";

import { CustomRequest } from "@/types/express/express.type";
import { AppError } from "@/utils/error/appError";
import { Response } from "express";

// Expense Category
export const getCategories = async (req: CustomRequest, res: Response) => {
  const categories = await getCategoriesS();
  res.status(200).json({ categories });
};

export const createExpenseCategory = async (
  req: CustomRequest,
  res: Response
) => {
  const { categories } = req.body;

  if (!categories || !Array.isArray(categories) || categories.length === 0) {
    throw new AppError("Categories array (name + icon) is required", 400);
  }

  for (const { name, icon } of categories) {
    if (!name || !icon) {
      throw new AppError("Each category must have a name and icon", 400);
    }
    const existing = await findExpenseCategoryS({ name });
    if (existing) throw new AppError(`Category "${name}" already exists`, 400);
  }

  const newCategories = await createExpenseCategoryS(categories);

  if (!newCategories) {
    throw new AppError("Error creating income categories", 400);
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
