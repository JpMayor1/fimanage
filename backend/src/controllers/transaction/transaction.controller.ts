import {
  addTransactionS,
  deleteTransactionS,
  getTransactionsS,
  updateTransactionS,
} from "@/services/transaction/transaction.service";
import { CustomRequest } from "@/types/express/express.type";
import { AppError } from "@/utils/error/appError";
import { Response } from "express";

export const getTransactions = async (req: CustomRequest, res: Response) => {
  const account = req.account;
  if (!account) throw new AppError("Unauthorized", 401);

  const skip = Number(req.query.skip) || 0;
  const limit = Number(req.query.limit) || 20;
  const type = (req.query.type as string | undefined) as
    | "income"
    | "expense"
    | "transfer"
    | "dept"
    | "receiving"
    | undefined;

  const { transactions, total } = await getTransactionsS(
    account._id,
    skip,
    limit,
    type
  );

  res.status(200).json({ transactions, total });
};

export const addTransaction = async (req: CustomRequest, res: Response) => {
  const account = req.account;
  if (!account) throw new AppError("Unauthorized", 401);

  const data = req.body;
  if (!data.type) throw new AppError("Transaction type is required.", 400);

  const newTransaction = await addTransactionS(account._id, data);

  res
    .status(200)
    .json({ message: "Transaction added.", newTransaction });
};

export const updateTransaction = async (req: CustomRequest, res: Response) => {
  const account = req.account;
  if (!account) throw new AppError("Unauthorized", 401);

  const { id } = req.params;
  if (!id) throw new AppError("Transaction ID is required.", 400);

  const data = req.body;

  const updatedTransaction = await updateTransactionS(id, account._id, data);

  res.status(200).json({
    message: "Transaction updated successfully.",
    updatedTransaction,
  });
};

export const deleteTransaction = async (req: CustomRequest, res: Response) => {
  const account = req.account;
  if (!account) throw new AppError("Unauthorized", 401);

  const { id } = req.params;
  if (!id) throw new AppError("Transaction ID is required.", 400);

  const deletedTransaction = await deleteTransactionS(id, account._id);

  res
    .status(200)
    .json({ message: "Transaction deleted.", deletedTransaction });
};


