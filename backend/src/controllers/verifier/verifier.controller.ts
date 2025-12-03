import { CustomRequest } from "@/types/express/express.type";
import { Response } from "express";

export const verify = (req: CustomRequest, res: Response) => {
  const account = req.account;
  res.status(200).json({ account });
};

export const verifySilent = (req: CustomRequest, res: Response) => {
  // Silent verifier - only returns auth status without errors
  if (req.account) {
    res.status(200).json({ authenticated: true });
  } else {
    res.status(200).json({ authenticated: false });
  }
};