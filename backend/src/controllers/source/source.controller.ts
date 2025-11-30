import {
  addSourceS,
  deleteSourceS,
  getSourcesS,
  updateSourceS,
} from "@/services/source/source.service";
import { CustomRequest } from "@/types/express/express.type";
import { AppError } from "@/utils/error/appError";
import { Response } from "express";

export const getSources = async (req: CustomRequest, res: Response) => {
  const account = req.account;
  const skip = Number(req.query.skip) || 0;
  const limit = Number(req.query.limit) || 20;

  const { sources, total } = await getSourcesS(account._id, skip, limit);

  res.status(200).json({ sources, total });
};

export const addSource = async (req: CustomRequest, res: Response) => {
  const account = req.account;
  const { name, balance } = req.body;
  if (!name) throw new AppError("Name is required.", 400);

  const newSource = await addSourceS({
    userId: account._id,
    name,
    balance,
  });
  res.status(200).json({ message: "Source added.", newSource });
};

export const updateSource = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;
  const { name, balance } = req.body;

  if (!id) throw new AppError("Source ID is required.", 400);
  if (!name) throw new AppError("Name is required.", 400);

  const updatedSource = await updateSourceS(id, {
    name,
    balance,
  });

  res
    .status(200)
    .json({ message: "Source updated successfully.", updatedSource });
};

export const deleteSource = async (req: CustomRequest, res: Response) => {
  const { id } = req.params;
  const deletedSource = await deleteSourceS(id);
  res.status(200).json({ message: "Source deleted.", deletedSource });
};
