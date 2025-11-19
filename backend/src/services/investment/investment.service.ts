import Investment from "@/models/investment.model";
import { AccountDocumentType } from "@/types/models/account.type";
import { InvestmentType } from "@/types/models/investment.type";
import { getPhDt } from "@/utils/date&time/getPhDt";
import { AppError } from "@/utils/error/appError";

export const getInvestmentsS = async (
  userId: string,
  skip: number,
  limit: number
) => {
  const total = await Investment.countDocuments({ userId });
  const investments = await Investment.find({ userId })
    .sort({ createdAt: -1 })
    .skip(Number(skip))
    .limit(Number(limit))
    .lean();

  return { investments, total };
};

export const addInvestmentS = async (
  account: AccountDocumentType,
  data: Partial<InvestmentType>
) => {
  const newInvestment = await Investment.create({
    ...data,
    dt: getPhDt(),
  });
  if (data.amount && data.amount > 0) {
    account.balance += Number(data.amount);
    await account.save();
  }
  return newInvestment;
};

export const updateInvestmentS = async (
  account: AccountDocumentType,
  id: string,
  data: Partial<InvestmentType>
) => {
  const investment = await Investment.findById(id);
  if (!investment) throw new AppError("Investment not found", 404);

  if (investment.userId.toString() !== account._id.toString()) {
    throw new AppError("Unauthorized investment update", 403);
  }

  if (data.amount !== undefined) {
    const oldAmount = investment.amount;
    const newAmount = data.amount;

    const diff = Number(newAmount) - Number(oldAmount);

    if (diff !== 0) {
      account.balance += diff;
      await account.save();
    }
  }

  Object.assign(investment, data, { dt: getPhDt() });
  await investment.save();

  return investment.toObject();
};

export const deleteInvestmentS = async (
  account: AccountDocumentType,
  id: string
) => {
  const deletedInvestment = await Investment.findByIdAndDelete(id);
  if (!deletedInvestment) throw new AppError("Investment not found", 404);
  account.balance -= deletedInvestment.amount;
  await account.save();
  return deletedInvestment;
};
