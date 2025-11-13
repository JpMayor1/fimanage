import { getDashboardDataS } from "@/services/dashboard/dashboard.service";
import { CustomRequest } from "@/types/express/express.type";
import { Response } from "express";

export const getDashboardData = async (req: CustomRequest, res: Response) => {
  const account = req.account;
  const { dailyExpense, totalBalances, totalIncomes, totalExpenses } =
    await getDashboardDataS(account._id);

  res.status(200).json({
    dailyExpense,
    totalBalances,
    totalIncomes,
    totalExpenses,
  });
};
