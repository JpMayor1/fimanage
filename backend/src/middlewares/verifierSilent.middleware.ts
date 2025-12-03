import Account from "@/models/account.model";
import { CustomRequest } from "@/types/express/express.type";
import { verifyToken } from "@/utils/jwt/jwt.util";
import type { NextFunction, Response } from "express";

// Silent verifier middleware - doesn't log errors or throw exceptions
// Only sets req.account if token is valid, otherwise leaves it undefined
const verifierSilent = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      // No token - continue without setting account
      return next();
    }

    const decoded = verifyToken(token);

    if (!decoded || !decoded.accountId) {
      // Invalid token - continue without setting account
      return next();
    }

    const account = await Account.findById(decoded.accountId).select(
      "-password"
    );

    if (account) {
      // Valid account found - assign to request
      req.account = account;
    }

    next();
  } catch {
    // Silent catch - any error means unauthenticated
    // Continue without setting account
    next();
  }
};

export default verifierSilent;

