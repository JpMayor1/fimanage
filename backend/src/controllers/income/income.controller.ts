import {
  addIncomeS,
  deleteIncomeS,
  getIncomesS,
  updateIncomeS,
} from "@/services/income/income.service";
import { CustomRequest } from "@/types/express/express.type";

import { AppError } from "@/utils/error/appError";
import { Response } from "express";

export const getIncomes = async (req: CustomRequest, res: Response) => {
  const account = req.account;
  const skip = Number(req.query.skip) || 0;
  const limit = Number(req.query.limit) || 20;

  const { incomes, total } = await getIncomesS(account._id, skip, limit);

  res.status(200).json({ incomes, total });
};

export const addIncome = async (req: CustomRequest, res: Response) => {
  const account = req.account;
  const { icon, name, description, amount } = req.body;
  if (!icon) throw new AppError("Icon is required.", 400);
  if (!name) throw new AppError("Name is required.", 400);
  if (!Number(amount)) throw new AppError("Amount is required.", 400);

  const newIncome = await addIncomeS(account, {
    userId: account._id,
    icon,
    name,
    description: description?.trim() ? description.trim() : "No description.",
    amount,
  });
  res.status(200).json({ message: "Income added.", newIncome });
};

export const updateIncome = async (req: CustomRequest, res: Response) => {
  const account = req.account;
  const { id } = req.params;
  const { icon, name, description, amount } = req.body;

  if (!id) throw new AppError("Income ID is required.", 400);
  if (!name) throw new AppError("Name is required.", 400);
  if (!Number(amount)) throw new AppError("Amount is required.", 400);

  const updatedIncome = await updateIncomeS(account, id, {
    icon,
    name,
    description: description?.trim() ? description.trim() : "No description.",
    amount,
  });

  res
    .status(200)
    .json({ message: "Income updated successfully.", updatedIncome });
};

export const deleteIncome = async (req: CustomRequest, res: Response) => {
  const account = req.account;
  const { id } = req.params;
  const deletedIncome = await deleteIncomeS(account, id);
  res.status(200).json({ message: "Income deleted.", deletedIncome });
};
