import Source from "@/models/source.model";
import { SourceType } from "@/types/models/source.type";
import { AppError } from "@/utils/error/appError";

export const getSourcesS = async (
  userId: string,
  skip: number,
  limit: number
) => {
  const total = await Source.countDocuments({ userId });
  const sources = await Source.find({ userId })
    .sort({ createdAt: -1 })
    .skip(Number(skip))
    .limit(Number(limit))
    .lean();

  return { sources, total };
};

export const addSourceS = async (data: Partial<SourceType>) => {
  const newSource = await Source.create({
    ...data,
    income: 0,
    expense: 0,
    balance: data.balance || 0,
  });
  return newSource;
};

export const updateSourceS = async (id: string, data: Partial<SourceType>) => {
  const source = await Source.findById(id);
  if (!source) throw new AppError("Source not found", 404);

  const updatedSource = await Source.findByIdAndUpdate(id, data, {
    new: true,
  }).lean();

  return updatedSource;
};

export const deleteSourceS = async (id: string) => {
  const deletedSource = await Source.findByIdAndDelete(id);
  if (!deletedSource) throw new AppError("Source not found", 404);

  return deletedSource;
};
