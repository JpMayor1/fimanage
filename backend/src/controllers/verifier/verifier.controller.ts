import { CustomRequest } from "@/types/express/express.type";
import { Response } from "express";

export const verify = (req: CustomRequest, res: Response) => {
  const account = req.account;
  res.status(200).json({ account });
};
