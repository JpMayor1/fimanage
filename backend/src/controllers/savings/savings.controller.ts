import {
  createSavingCategoryS,
  deleteCategoryS,
  findSavingCategoryS,
  getCategoriesS,
  updateCategoryS,
} from "@/services/savings/savings.service";
import { CustomRequest } from "@/types/express/express.type";
import { SavingCategoryType } from "@/types/models/savingsCategory.type";
import { AppError } from "@/utils/error/appError";
import { Response } from "express";

// Saving Category
export const getCategories = async (req: CustomRequest, res: Response) => {
  const account = req.account;
  const categories = await getCategoriesS(account._id);
  res.status(200).json({ categories });
};

export const createSavingCategory = async (
  req: CustomRequest,
  res: Response
) => {
  const account = req.account;
  const { categories } = req.body;

  if (!categories || !Array.isArray(categories) || categories.length === 0) {
    throw new AppError("Categories array (name) is required", 400);
  }

  const processedCategories = [];
  for (const { name } of categories) {
    if (!name) {
      throw new AppError("Each category must have a name", 400);
    }

    const existing = await findSavingCategoryS({ name, userId: account._id });
    if (existing) throw new AppError(`Category "${name}" already exists`, 400);

    processedCategories.push({
      name,
      userId: account._id,
    });
  }

  const newCategories = await createSavingCategoryS(
    processedCategories as SavingCategoryType[]
  );

  if (!newCategories) {
    throw new AppError("Error creating savings categories", 400);
  }

  res.status(201).json({
    message: "Categories created successfully.",
    newCategories,
  });
};

export const updateCategory = async (req: CustomRequest, res: Response) => {
  const { categoryId, name } = req.body;

  if (!categoryId) throw new AppError("Category ID is required", 400);
  if (!name) {
    throw new AppError("At least one of name is required", 400);
  }

  const updatedCategory = await updateCategoryS(categoryId, { name });

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

// Saving
