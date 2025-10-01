import {
  createIncomeCategoryS,
  findIncomeCategoryS,
  getCategoriesS,
  updateCategoryS,
} from "@/services/income/income.service";
import { CustomRequest } from "@/types/express/express.type";
import { AppError } from "@/utils/error/appError";
import { Response } from "express";

export const getCategories = async (req: CustomRequest, res: Response) => {
  const categories = await getCategoriesS();
  res.status(200).json({ categories });
};

export const createIncomeCategory = async (
  req: CustomRequest,
  res: Response
) => {
  const { names } = req.body;

  if (!names || !Array.isArray(names) || names.length === 0) {
    throw new AppError("Names array is required", 400);
  }

  // Check duplicates before inserting
  for (const name of names) {
    const existing = await findIncomeCategoryS({ name });
    if (existing) throw new AppError(`Category "${name}" already exists`, 400);
  }

  const newCategories = await createIncomeCategoryS(names);

  if (!newCategories) {
    throw new AppError("Error creating income categories", 400);
  }

  res.status(201).json({
    message: "Categories created successfully.",
    newCategories,
  });
};

export const updateCategory = async (req: CustomRequest, res: Response) => {
  const { categoryId, newName } = req.body;
  const updatedCategory = await updateCategoryS(categoryId, newName);
  if (!updatedCategory) throw new AppError("Error updating gategory", 400);
  res.status(200).json({
    message: "Category updated successfully.",
    updatedCategory,
  });
};
