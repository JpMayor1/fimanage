import { getDashboardDataS } from "@/services/dashboard/dashboard.service";
import { CustomRequest } from "@/types/express/express.type";
import { Response } from "express";

export const getDashboardData = async (req: CustomRequest, res: Response) => {
  const account = req.account;
  const { dailyExpense } = await getDashboardDataS(account._id);

  res.status(200).json({
    dailyExpense,
  });
};
