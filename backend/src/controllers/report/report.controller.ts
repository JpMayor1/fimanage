import { getReportDataS } from "@/services/report/report.service";
import { CustomRequest } from "@/types/express/express.type";
import { Response } from "express";

export const getReportData = async (req: CustomRequest, res: Response) => {
  const account = req.account;
  const period = (req.query.period as "week" | "month" | "year") || "month";

  const reportData = await getReportDataS(account._id.toString(), period);

  res.status(200).json(reportData);
};

