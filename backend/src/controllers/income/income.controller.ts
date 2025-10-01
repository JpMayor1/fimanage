import {
  createIncomeCategoryS,
  findIncomeCategoryS,
  getCategoriesS,
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
