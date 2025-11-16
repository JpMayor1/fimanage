import Income from "@/models/income.model";
import { AccountDocumentType } from "@/types/models/account.type";
import { IncomeType } from "@/types/models/income.type";
import { getPhDt } from "@/utils/date&time/getPhDt";
import { AppError } from "@/utils/error/appError";

export const getIncomesS = async (
  userId: string,
  skip: number,
  limit: number
) => {
  const total = await Income.countDocuments({ userId });
  const incomes = await Income.find({ userId })
    .sort({ createdAt: -1 })
    .skip(Number(skip))
    .limit(Number(limit))
    .lean();

  return { incomes, total };
};
export const addIncomeS = async (
  account: AccountDocumentType,
  data: Partial<IncomeType>
) => {
  const newIncome = await Income.create({
    ...data,
    dt: getPhDt(),
  });

  if (data.amount && data.amount > 0) {
    account.balance += Number(data.amount);
    await account.save();
  }

  return newIncome;
};

export const updateIncomeS = async (
  account: AccountDocumentType,
  id: string,
  data: Partial<IncomeType>
) => {
  const income = await Income.findById(id);
  if (!income) throw new AppError("Income not found", 404);

  if (data.amount !== undefined) {
    const oldAmount = income.amount;
    const newAmount = data.amount;
    const difference = newAmount - oldAmount;
    account.balance += difference;
    await account.save();
  }

  const updatedIncome = await Income.findByIdAndUpdate(
    id,
    { ...data, dt: getPhDt() },
    { new: true }
  ).lean();

  return updatedIncome;
};

export const deleteIncomeS = async (
  account: AccountDocumentType,
  id: string
) => {
  const deletedIncome = await Income.findByIdAndDelete(id);
  if (!deletedIncome) throw new AppError("Income not found", 404);

  account.balance -= deletedIncome.amount;
  await account.save();

  return deletedIncome;
};
