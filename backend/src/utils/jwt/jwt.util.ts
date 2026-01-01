import type { Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export const generateToken = (accountId: string, res: Response) => {
  const token = jwt.sign({ accountId }, process.env.JWT_SECRET as string, {
    expiresIn: "15d",
  });

  res.cookie("token", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "none",
    secure: process.env.NODE_ENV === "production",
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload & {
    accountId: string;
  };
};
