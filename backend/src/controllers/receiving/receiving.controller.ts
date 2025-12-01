import {
  addReceivingS,
  deleteReceivingS,
  getReceivingsS,
  updateReceivingS,
} from "@/services/receiving/receiving.service";
import { CustomRequest } from "@/types/express/express.type";
import { AppError } from "@/utils/error/appError";
import { Response } from "express";

export const getReceivings = async (req: CustomRequest, res: Response) => {
  const account = req.account;
  const skip = Number(req.query.skip) || 0;
  const limit = Number(req.query.limit) || 20;

  const { receivings, total } = await getReceivingsS(account._id, skip, limit);

  res.status(200).json({ receivings, total });
};

export const addReceiving = async (req: CustomRequest, res: Response) => {
  const account = req.account;
  const { borrower, amount, remaining, dueDate, interest, note } = req.body;
  if (!borrower) throw new AppError("Lender is required.", 400);
  if (!amount) throw new AppError("Amount is required.", 400);

  const newReceiving = await addReceivingS({
    userId: account._id,
    borrower,
    amount,
    remaining,
    dueDate,
    interest,
    note,
  });
  res.status(200).json({ message: "Receiving added.", newReceiving });
};

export const updateReceiving = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;
  const { borrower, amount, remaining, dueDate, interest, note } = req.body;
  if (!borrower) throw new AppError("Lender is required.", 400);
  if (!amount) throw new AppError("Amount is required.", 400);

  const updatedReceiving = await updateReceivingS(id, {
    borrower,
    amount,
    remaining,
    dueDate,
    interest,
    note,
  });

  res
    .status(200)
    .json({ message: "Receiving updated successfully.", updatedReceiving });
};

export const deleteReceiving = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;
  const deletedReceiving = await deleteReceivingS(id);
  res.status(200).json({ message: "Receiving deleted.", deletedReceiving });
};
