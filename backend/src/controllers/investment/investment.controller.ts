import {
  addInvestmentS,
  deleteInvestmentS,
  getInvestmentsS,
  updateInvestmentS,
} from "@/services/investment/investment.service";
import { CustomRequest } from "@/types/express/express.type";
import { AppError } from "@/utils/error/appError";
import { Response } from "express";

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
  const { name, description, amount, annualRate, frequency } = req.body;
  if (!name) throw new AppError("Name is required.", 400);
  if (!Number(amount)) throw new AppError("Amount is required.", 400);

  const newInvestment = await addInvestmentS(account, {
    userId: account._id,
    name,
    description: description?.trim() ? description.trim() : "No description.",
    amount,
    annualRate,
    frequency,
  });
  res.status(200).json({ message: "Investment added.", newInvestment });
};

export const updateInvestment = async (req: CustomRequest, res: Response) => {
  const account = req.account;
  const { id } = req.params;
  const { name, description, amount, annualRate, frequency } = req.body;

  if (!id) throw new AppError("Investment ID is required.", 400);
  if (!name) throw new AppError("Name is required.", 400);
  if (!Number(amount)) throw new AppError("Amount is required.", 400);

  const updatedInvestment = await updateInvestmentS(account, id, {
    name,
    description: description?.trim() ? description.trim() : "No description.",
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
