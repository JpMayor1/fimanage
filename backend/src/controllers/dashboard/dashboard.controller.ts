import { getDashboardDataS } from "@/services/dashboard/dashboard.service";
import { CustomRequest } from "@/types/express/express.type";
import { Response } from "express";

export const getDashboardData = async (req: CustomRequest, res: Response) => {
  const account = req.account;
  const {
    dailyExpense,
    totalIncomes,
    totalExpenses,
    totalSavings,
    totalInvestments,
  } = await getDashboardDataS(account._id);

  res.status(200).json({
    balance: account.balance,
    dailyExpense,
    totalIncomes,
    totalExpenses,
    totalSavings,
    totalInvestments,
  });
};

export const updateBalance = async (req: CustomRequest, res: Response) => {
  const { balance } = req.body;
  const account = req.account;
  account.balance = balance;
  await account.save();
  res.status(200).json({ message: "Balance updated." });
};
