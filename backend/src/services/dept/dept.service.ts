import Dept from "@/models/dept.model";
import { DeptType } from "@/types/models/dept.type";
import { formatDate } from "@/utils/date&time/getPhDt";
import { AppError } from "@/utils/error/appError";

export const getDeptsS = async (
  userId: string,
  skip: number,
  limit: number
) => {
  const total = await Dept.countDocuments({ userId });
  const depts = await Dept.find({ userId })
    .sort({ createdAt: -1 })
    .skip(Number(skip))
    .limit(Number(limit))
    .lean();

  return { depts, total };
};

export const addDeptS = async (data: Partial<DeptType>) => {
  // Ensure numeric fields are never null (0 is acceptable)
  const amount = data.amount != null ? Number(data.amount) || 0 : 0;
  const remaining = data.remaining != null ? Number(data.remaining) || 0 : 0;
  const interest = data.interest != null ? Number(data.interest) || 0 : 0;

  const newDept = await Dept.create({
    ...data,
    amount,
    remaining,
    interest,
    dueDate: formatDate(data.dueDate || ""),
  });
  return newDept;
};

export const updateDeptS = async (id: string, data: Partial<DeptType>) => {
  const dept = await Dept.findById(id);
  if (!dept) throw new AppError("Dept not found", 404);

  // Ensure numeric fields are never null (0 is acceptable)
  const updateData: Partial<DeptType> = { ...data };
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

  const updatedDept = await Dept.findByIdAndUpdate(id, updateData, {
    new: true,
  }).lean();

  return updatedDept;
};

export const deleteDeptS = async (id: string) => {
  const deletedDept = await Dept.findByIdAndDelete(id);
  if (!deletedDept) throw new AppError("Dept not found", 404);

  return deletedDept;
};
