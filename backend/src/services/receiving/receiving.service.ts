import Receiving from "@/models/receiving.model";
import { ReceivingType } from "@/types/models/receiving.type";
import { formatDate } from "@/utils/date&time/getPhDt";
import { AppError } from "@/utils/error/appError";

export const getReceivingsS = async (
  userId: string,
  skip: number,
  limit: number
) => {
  const total = await Receiving.countDocuments({ userId });
  const receivings = await Receiving.find({ userId })
    .sort({ createdAt: -1 })
    .skip(Number(skip))
    .limit(Number(limit))
    .lean();

  return { receivings, total };
};

export const addReceivingS = async (data: Partial<ReceivingType>) => {
  const newReceiving = await Receiving.create({
    ...data,
    dueDate: formatDate(data.dueDate || ""),
  });
  return newReceiving;
};

export const updateReceivingS = async (
  id: string,
  data: Partial<ReceivingType>
) => {
  const receiving = await Receiving.findById(id);
  if (!receiving) throw new AppError("Receiving not found", 404);

  const updatedReceiving = await Receiving.findByIdAndUpdate(
    id,
    {
      ...data,
      dueDate: formatDate(data.dueDate || ""),
    },
    {
      new: true,
    }
  ).lean();

  return updatedReceiving;
};

export const deleteReceivingS = async (id: string) => {
  const deletedReceiving = await Receiving.findByIdAndDelete(id);
  if (!deletedReceiving) throw new AppError("Receiving not found", 404);

  return deletedReceiving;
};
