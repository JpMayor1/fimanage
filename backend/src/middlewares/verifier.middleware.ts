import Account from "@/models/account.model";
import { CustomRequest } from "@/types/express/express.type";
import { verifyToken } from "@/utils/jwt/jwt.util";
import type { NextFunction, Response } from "express";

const verifier = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No Token Provided" });
    }

    const decoded = verifyToken(token);

    if (!decoded || !decoded.accountId) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    const account = await Account.findById(decoded.accountId).select(
      "-password"
    );

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    // Assign account to the request object
    req.account = account;

    next();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("Error in verifier middleware:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.status(500).json({ error: "Internal Server Error " });
    }
  }
};

export default verifier;
