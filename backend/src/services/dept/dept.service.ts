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
  const newDept = await Dept.create({
    ...data,
    dueDate: formatDate(data.dueDate || ""),
  });
  return newDept;
};

export const updateDeptS = async (id: string, data: Partial<DeptType>) => {
  const dept = await Dept.findById(id);
  if (!dept) throw new AppError("Dept not found", 404);

  const updatedDept = await Dept.findByIdAndUpdate(
    id,
    {
      ...data,
      dueDate: formatDate(data.dueDate || ""),
    },
    {
      new: true,
    }
  ).lean();

  return updatedDept;
};

export const deleteDeptS = async (id: string) => {
  const deletedDept = await Dept.findByIdAndDelete(id);
  if (!deletedDept) throw new AppError("Dept not found", 404);

  return deletedDept;
};
