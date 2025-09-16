import { findAccountS, registerAccountS } from "@/services/auth/auth.service";
import { comparePassword, hashPassword } from "@/utils/bcrypt/bcrypt";
import { AppError } from "@/utils/error/appError";
import generateToken from "@/utils/jwt/generateToken";
import { Request, Response } from "express";

export const register = async (req: Request, res: Response) => {
  const { name, email, username, password, address } = req.body;
  if (!name) {
    throw new AppError("Name is required.", 400);
  }
  if (!email) {
    throw new AppError("Email is required.", 400);
  }
  if (!password) {
    throw new AppError("Password is required.", 400);
  }
  if (!address) {
    throw new AppError("Address is required.", 400);
  }

  const emailExist = await findAccountS({ email });
  if (emailExist) {
    throw new AppError("Email already exist.", 409);
  }

  const usernameExist = await findAccountS({ username });
  if (usernameExist) {
    throw new AppError("Username already exist.", 409);
  }

  const hashedPassword = await hashPassword(password);

  const account = await registerAccountS({
    name,
    email,
    username,
    password: hashedPassword,
    address,
  });

  generateToken(account._id.toString(), res);

  const user = {
    _id: account._id,
    name: account.name,
    email: account.email,
    username: account.username,
  };

  res.status(200).json({ message: "Account registered successfuly.", user });
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username) {
    throw new AppError("Username is required.", 400);
  }
  if (!password) {
    throw new AppError("Password is required.", 400);
  }

  const account = await findAccountS({ username });
  if (!account) {
    throw new AppError("Account not found.", 404);
  }

  const isPasswordCorrect = await comparePassword(
    password,
    account.password || ""
  );
  if (!isPasswordCorrect) {
    throw new AppError("Incorrect credentials.", 401);
  }

  generateToken(account._id.toString(), res);

  const user = {
    _id: account._id,
    name: account.name,
    email: account.email,
    username: account.username,
  };

  res.status(200).json({ message: "Login successfuly.", user });
};

export const logout = (req: Request, res: Response) => {
  res.cookie("token", "", { maxAge: 0 });
  res.status(200).json({ message: "Logged out successfully" });
};
