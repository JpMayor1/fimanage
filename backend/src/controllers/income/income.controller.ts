import {
  addIncomeS,
  createIncomeCategoryS,
  deleteCategoryS,
  deleteIncomeS,
  findIncomeCategoryS,
  getCategoriesS,
  getIncomesS,
  updateCategoryS,
  updateIncomeS,
} from "@/services/income/income.service";
import { CustomRequest } from "@/types/express/express.type";
import { IncomeCategoryType } from "@/types/models/IncomeCategoryType";
import { AppError } from "@/utils/error/appError";
import { Response } from "express";

// Income Category
export const getCategories = async (req: CustomRequest, res: Response) => {
  const account = req.account;
  const categories = await getCategoriesS(account._id);
  res.status(200).json({ categories });
};

export const createIncomeCategory = async (
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

    const existing = await findIncomeCategoryS({ name, userId: account._id });
    if (existing) throw new AppError(`Category "${name}" already exists`, 400);

    processedCategories.push({
      name,
      icon,
      userId: account._id,
    });
  }

  const newCategories = await createIncomeCategoryS(
    processedCategories as IncomeCategoryType[]
  );

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

// Income
export const getIncomes = async (req: CustomRequest, res: Response) => {
  const account = req.account;
  const incomes = await getIncomesS(account._id);
  res.status(200).json({ incomes });
};

export const addIncome = async (req: CustomRequest, res: Response) => {
  const account = req.account;
  const { description, category, amount } = req.body;
  if (!description) throw new AppError("Description is required.", 400);
  if (!category) throw new AppError("Category is required.", 400);
  if (!Number(amount)) throw new AppError("Amount is required.", 400);

  const newIncome = await addIncomeS({
    userId: account._id,
    category,
    description,
    amount,
  });
  res.status(200).json({ message: "Income added.", newIncome });
};

export const updateIncome = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;
  const { description, category, amount } = req.body;

  if (!id) throw new AppError("Income ID is required.", 400);
  if (!description) throw new AppError("Description is required.", 400);
  if (!category) throw new AppError("Category is required.", 400);
  if (!Number(amount)) throw new AppError("Amount is required.", 400);

  const updatedIncome = await updateIncomeS(id, {
    description,
    category,
    amount,
  });

  res
    .status(200)
    .json({ message: "Income updated successfully.", updatedIncome });
};

export const deleteIncome = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;
  const deletedIncome = await deleteIncomeS(id);
  res.status(200).json({ message: "Income deleted.", deletedIncome });
};
