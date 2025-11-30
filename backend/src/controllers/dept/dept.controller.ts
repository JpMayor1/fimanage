import {
  addDeptS,
  deleteDeptS,
  getDeptsS,
  updateDeptS,
} from "@/services/dept/dept.service";
import { CustomRequest } from "@/types/express/express.type";
import { AppError } from "@/utils/error/appError";
import { Response } from "express";

export const getDepts = async (req: CustomRequest, res: Response) => {
  const account = req.account;
  const skip = Number(req.query.skip) || 0;
  const limit = Number(req.query.limit) || 20;

  const { depts, total } = await getDeptsS(account._id, skip, limit);

  res.status(200).json({ depts, total });
};

export const addDept = async (req: CustomRequest, res: Response) => {
  const account = req.account;
  const { lender, amount, remaining, dueDate, interest, note } = req.body;
  if (!lender) throw new AppError("Lender is required.", 400);
  if (!amount) throw new AppError("Amount is required.", 400);

  const newDept = await addDeptS({
    userId: account._id,
    lender,
    amount,
    remaining,
    dueDate,
    interest,
    note,
  });
  res.status(200).json({ message: "Dept added.", newDept });
};

export const updateDept = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;
  const { lender, amount, remaining, dueDate, interest, note } = req.body;
  if (!lender) throw new AppError("Lender is required.", 400);
  if (!amount) throw new AppError("Amount is required.", 400);

  const updatedDept = await updateDeptS(id, {
    lender,
    amount,
    remaining,
    dueDate,
    interest,
    note,
  });

  res.status(200).json({ message: "Dept updated successfully.", updatedDept });
};

export const deleteDept = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;
  const deletedDept = await deleteDeptS(id);
  res.status(200).json({ message: "Dept deleted.", deletedDept });
};
