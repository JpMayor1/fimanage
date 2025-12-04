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
  // Ensure numeric fields are never null (0 is acceptable)
  const amount = data.amount != null ? Number(data.amount) || 0 : 0;
  const remaining = data.remaining != null ? Number(data.remaining) || 0 : 0;
  const interest = data.interest != null ? Number(data.interest) || 0 : 0;
  
  const newReceiving = await Receiving.create({
    ...data,
    amount,
    remaining,
    interest,
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

  // Ensure numeric fields are never null (0 is acceptable)
  const updateData: Partial<ReceivingType> = { ...data };
  if (data.amount != null) {
    updateData.amount = Number(data.amount) || 0;
  }
  if (data.remaining != null) {
    updateData.remaining = Number(data.remaining) || 0;
  }
  if (data.interest != null) {
    updateData.interest = Number(data.interest) || 0;
  }
  updateData.dueDate = formatDate(data.dueDate || "");

  const updatedReceiving = await Receiving.findByIdAndUpdate(
    id,
    updateData,
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
