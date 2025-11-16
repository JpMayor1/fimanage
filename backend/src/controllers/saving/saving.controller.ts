import {
  addSavingS,
  deleteSavingS,
  getSavingsS,
  updateSavingS,
} from "@/services/saving/saving.service";
import { CustomRequest } from "@/types/express/express.type";
import { AppError } from "@/utils/error/appError";
import { Response } from "express";

export const getSavings = async (req: CustomRequest, res: Response) => {
  const account = req.account;
  const skip = Number(req.query.skip) || 0;
  const limit = Number(req.query.limit) || 20;

  const { savings, total } = await getSavingsS(account._id, skip, limit);
  res.status(200).json({ savings, total });
};

export const addSaving = async (req: CustomRequest, res: Response) => {
  const account = req.account;
  const { name, description, amount, annualRate, frequency } = req.body;
  if (!name) throw new AppError("Category is required.", 400);
  if (!Number(amount)) throw new AppError("Amount is required.", 400);

  const newSaving = await addSavingS(account, {
    userId: account._id,
    name,
    description: description?.trim() ? description.trim() : "No description.",
    amount,
    annualRate,
    frequency,
  });
  res.status(200).json({ message: "Saving added.", newSaving });
};

export const updateSaving = async (req: CustomRequest, res: Response) => {
  const account = req.account;
  const { id } = req.params;
  const { name, description, amount, annualRate, frequency } = req.body;

  if (!id) throw new AppError("Saving ID is required.", 400);
  if (!name) throw new AppError("Category is required.", 400);
  if (amount === undefined || isNaN(Number(amount)))
    throw new AppError("Amount is required.", 400);

  const updatedSaving = await updateSavingS(account, id, {
    name,
    description: description?.trim() ? description.trim() : "No description.",
    amount,
    annualRate,
    frequency,
  });

  res
    .status(200)
    .json({ message: "Saving updated successfully.", updatedSaving });
};

export const deleteSaving = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;
  const deletedSaving = await deleteSavingS(id);
  res.status(200).json({ message: "Saving deleted.", deletedSaving });
};
