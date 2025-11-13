import {
  addBalanceS,
  deleteBalanceS,
  getBalancesS,
  updateBalanceS,
} from "@/services/balance/balance.sevice";
import { CustomRequest } from "@/types/express/express.type";
import { AppError } from "@/utils/error/appError";
import { Response } from "express";

// Balance
export const getBalances = async (req: CustomRequest, res: Response) => {
  const account = req.account;
  const { balances } = await getBalancesS(account._id);
  res.status(200).json({ balances });
};

export const addBalance = async (req: CustomRequest, res: Response) => {
  const account = req.account;
  const { icon, name, amount } = req.body;
  if (!icon) throw new AppError("Description is required.", 400);
  if (!name) throw new AppError("Category is required.", 400);
  if (!Number(amount)) throw new AppError("Amount is required.", 400);

  const newBalance = await addBalanceS({
    userId: account._id,
    icon,
    name,
    amount,
  });
  res.status(200).json({ message: "Balance added.", newBalance });
};

export const updateBalance = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;
  const { icon, name, amount } = req.body;

  if (!id) throw new AppError("Balance ID is required.", 400);
  if (!icon) throw new AppError("Description is required.", 400);
  if (!name) throw new AppError("Category is required.", 400);
  if (!Number(amount)) throw new AppError("Amount is required.", 400);

  const updatedBalance = await updateBalanceS(id, {
    icon,
    name,
    amount,
  });

  res
    .status(200)
    .json({ message: "Balance updated successfully.", updatedBalance });
};

export const deleteBalance = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;
  const deletedBalance = await deleteBalanceS(id);
  res.status(200).json({ message: "Balance deleted.", deletedBalance });
};
