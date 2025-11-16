import {
  addExpenseS,
  deleteExpenseS,
  getExpensesS,
  getSourcesS,
  updateExpenseS,
  updateLimitS,
} from "@/services/expense/expense.service";

import { CustomRequest } from "@/types/express/express.type";
import { AppError } from "@/utils/error/appError";
import { Response } from "express";

export const getExpenses = async (req: CustomRequest, res: Response) => {
  const account = req.account;
  const skip = Number(req.query.skip) || 0;
  const limit = Number(req.query.limit) || 20;

  const { expenses, total } = await getExpensesS(account._id, skip, limit);
  res.status(200).json({ limit: account.limit, expenses, total });
};

export const getSources = async (req: CustomRequest, res: Response) => {
  const account = req.account;
  const { savings, investments } = await getSourcesS(account._id);
  res.status(200).json({ savings, investments });
};

export const addExpense = async (req: CustomRequest, res: Response) => {
  const account = req.account;
  const { icon, name, description, amount, countable, savingId, investmentId } =
    req.body;
  if (!icon) throw new AppError("Icon is required.", 400);
  if (!name) throw new AppError("Name is required.", 400);
  if (!Number(amount)) throw new AppError("Amount is required.", 400);

  const newExpense = await addExpenseS(account, {
    userId: account._id,
    icon,
    name,
    description: description?.trim() ? description.trim() : "No description.",
    amount,
    countable,
    savingId,
    investmentId,
  });
  res.status(200).json({ message: "Expense added.", newExpense });
};

export const updateExpense = async (req: CustomRequest, res: Response) => {
  const account = req.account;
  const { id } = req.params;
  const { icon, name, description, amount, countable, savingId, investmentId } =
    req.body;

  if (!id) throw new AppError("Expense ID is required.", 400);
  if (!name) throw new AppError("Name is required.", 400);
  if (!Number(amount)) throw new AppError("Amount is required.", 400);

  const updatedExpense = await updateExpenseS(account, id, {
    icon,
    name,
    description: description?.trim() ? description.trim() : "No description.",
    amount,
    countable,
    savingId,
    investmentId,
  });

  res
    .status(200)
    .json({ message: "Expense updated successfully.", updatedExpense });
};

export const deleteExpense = async (req: CustomRequest, res: Response) => {
  const account = req.account;
  const { id } = req.params;
  const deletedExpense = await deleteExpenseS(account, id);
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
