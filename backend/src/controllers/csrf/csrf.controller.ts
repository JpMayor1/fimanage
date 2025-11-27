import { CustomRequest } from "@/types/express/express.type";
import { Response } from "express";

export const csrf = (req: CustomRequest, res: Response) => {
  res.json({ csrfToken: req.csrfToken() });
};
