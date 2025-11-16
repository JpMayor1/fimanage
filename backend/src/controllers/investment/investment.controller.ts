import {
  addInvestmentS,
  createInvestmentCategoryS,
  deleteCategoryS,
  deleteInvestmentS,
  findInvestmentCategoryS,
  getCategoriesS,
  getInvestmentsS,
  updateCategoryS,
  updateInvestmentS,
} from "@/services/investment/investment.service";
import { CustomRequest } from "@/types/express/express.type";
import { InvestmentCategoryType } from "@/types/models/investmentCategory.type";
import { AppError } from "@/utils/error/appError";
import { Response } from "express";

// Investment Category
export const getCategories = async (req: CustomRequest, res: Response) => {
  const account = req.account;
  const categories = await getCategoriesS(account._id);
  res.status(200).json({ categories });
};

export const createInvestmentCategory = async (
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

    const existing = await findInvestmentCategoryS({
      name,
      userId: account._id,
    });
    if (existing) throw new AppError(`Category "${name}" already exists`, 400);

    processedCategories.push({
      name,
      userId: account._id,
    });
  }

  const newCategories = await createInvestmentCategoryS(
    processedCategories as InvestmentCategoryType[]
  );

  if (!newCategories) {
    throw new AppError("Error creating investments categories", 400);
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

// Investment
export const getInvestments = async (req: CustomRequest, res: Response) => {
  const account = req.account;
  const skip = Number(req.query.skip) || 0;
  const limit = Number(req.query.limit) || 20;

  const { investments, total } = await getInvestmentsS(
    account._id,
    skip,
    limit
  );
  res.status(200).json({ investments, total });
};

export const addInvestment = async (req: CustomRequest, res: Response) => {
  const account = req.account;
  const { description, category, amount, annualRate, frequency } = req.body;
  if (!description) throw new AppError("Description is required.", 400);
  if (!category) throw new AppError("Category is required.", 400);
  if (!Number(amount)) throw new AppError("Amount is required.", 400);

  const newInvestment = await addInvestmentS(account, {
    userId: account._id,
    category,
    description,
    amount,
    annualRate,
    frequency,
  });
  res.status(200).json({ message: "Investment added.", newInvestment });
};

export const updateInvestment = async (req: CustomRequest, res: Response) => {
  const account = req.account;
  const { id } = req.params;
  const { description, category, amount, annualRate, frequency } = req.body;

  if (!id) throw new AppError("Investment ID is required.", 400);
  if (!description) throw new AppError("Description is required.", 400);
  if (!category) throw new AppError("Category is required.", 400);
  if (!Number(amount)) throw new AppError("Amount is required.", 400);

  const updatedInvestment = await updateInvestmentS(account, id, {
    description,
    category,
    amount,
    annualRate,
    frequency,
  });

  res
    .status(200)
    .json({ message: "Investment updated successfully.", updatedInvestment });
};

export const deleteInvestment = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;
  const deletedInvestment = await deleteInvestmentS(id);
  res.status(200).json({ message: "Investment deleted.", deletedInvestment });
};
