import {
  createIncomeCategoryS,
  findIncomeCategoryS,
} from "@/services/income/income.service";
import { CustomRequest } from "@/types/express/express.type";
import { AppError } from "@/utils/error/appError";
import { Response } from "express";

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

  const incomeCategories = await createIncomeCategoryS(names);

  if (!incomeCategories || incomeCategories.length === 0) {
    throw new AppError("Error creating income categories", 400);
  }

  res.status(201).json({
    message: "Categories created successfully.",
    incomeCategories,
  });
};
