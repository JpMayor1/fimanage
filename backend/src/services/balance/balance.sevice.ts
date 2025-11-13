import Balance from "@/models/balance.model";
import { BalanceType } from "@/types/models/balance.type";
import { getPhDt } from "@/utils/date&time/getPhDt";
import { AppError } from "@/utils/error/appError";

// Balance
export const getBalancesS = async (userId: string) => {
  const balances = await Balance.find({ userId })
    .sort({ createdAt: -1 })
    .lean();

  return { balances };
};

export const addBalanceS = async (data: Partial<BalanceType>) => {
  const newBalance = await Balance.create({
    ...data,
    dt: getPhDt(),
  });

  if (data.amount && data.amount > 0) {
  }

  return newBalance;
};

export const updateBalanceS = async (
  id: string,
  data: Partial<BalanceType>
) => {
  const balance = await Balance.findById(id);
  if (!balance) throw new AppError("Balance not found", 404);

  const updatedBalance = await Balance.findByIdAndUpdate(
    id,
    { ...data, dt: getPhDt() },
    { new: true }
  ).lean();

  return updatedBalance;
};

export const deleteBalanceS = async (id: string) => {
  const deletedBalance = await Balance.findByIdAndDelete(id);
  if (!deletedBalance) throw new AppError("Balance not found", 404);

  return deletedBalance;
};
