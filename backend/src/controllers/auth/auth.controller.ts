import Account from "@/models/account.model";
import { findAccountS, registerAccountS } from "@/services/auth/auth.service";
import { sendPasswordResetEmail } from "@/services/email/email.service";
import { comparePassword, hashPassword } from "@/utils/bcrypt/bcrypt";
import { deleteFile } from "@/utils/deleteFile/deleteFile";
import { AppError } from "@/utils/error/appError";
import { generateToken } from "@/utils/jwt/jwt.util";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";
import { Request, Response } from "express";

export const register = async (req: Request, res: Response): Promise<void> => {
  const {
    publicId,
    profilePicture,
    firstName,
    middleName,
    lastName,
    suffix,
    address,
    email,
    username,
    password,
  } = req.body;

  // 1. Validate required fields
  const requiredFields: Record<string, string | undefined> = {
    "First name": firstName,
    "Last name": lastName,
    Email: email,
    Password: password,
    Address: address,
  };

  for (const [field, value] of Object.entries(requiredFields)) {
    if (!value) {
      if (publicId) await deleteFile(publicId);
      throw new AppError(`${field} is required.`, 400);
    }
  }

  // 2. Check duplicates
  if (await findAccountS({ email })) {
    if (publicId) await deleteFile(publicId);
    throw new AppError("Email already exists.", 409);
  }

  if (await findAccountS({ username })) {
    if (publicId) await deleteFile(publicId);
    throw new AppError("Username already exists.", 409);
  }

  // 3. Hash password
  const hashedPassword = await hashPassword(password);

  // 4. Create account
  const account = await registerAccountS({
    publicId,
    profilePicture,
    firstName,
    middleName,
    lastName,
    suffix,
    email,
    username,
    password: hashedPassword,
    address,
  });

  if (!account) {
    if (publicId) await deleteFile(publicId);
    throw new AppError("Error creating account.", 400);
  }

  // 5. Generate token
  generateToken(account._id.toString(), res);

  // 6. Return response
  res.status(200).json({
    message: "Account registered successfully.",
    user: {
      _id: account._id,
      publicId: account.publicId,
      profilePicture: account.profilePicture,
      firstName: account.firstName,
      middleName: account.middleName,
      lastName: account.lastName,
      email: account.email,
      username: account.username,
      address: account.address,
    },
  });
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
    publicId: account.publicId,
    profilePicture: account.profilePicture,
    firstName: account.firstName,
    middleName: account.middleName,
    lastName: account.lastName,
    email: account.email,
    username: account.username,
    address: account.address,
  };

  res.status(200).json({ message: "Login successfuly.", user });
};

export const logout = (req: Request, res: Response) => {
  res.cookie("token", "", { maxAge: 0 });
  res.status(200).json({ message: "Logged out successfully" });
};

export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email } = req.body;

  if (!email) {
    throw new AppError("Email is required.", 400);
  }

  // Find account by email
  const account = await findAccountS({ email });
  if (!account) {
    // Don't reveal if email exists or not for security
    res.status(200).json({
      message:
        "If an account with that email exists, a password reset code has been sent.",
    });
    return;
  }

  const timeZone = "Asia/Manila";
  const now = new Date();
  const phTime = toZonedTime(now, timeZone);
  const today = formatInTimeZone(phTime, timeZone, "yyyy-MM-dd");

  // Check if we need to reset the daily counter
  const lastResetDate = account.passwordResetLastResetDate
    ? formatInTimeZone(
        new Date(account.passwordResetLastResetDate),
        timeZone,
        "yyyy-MM-dd"
      )
    : null;

  let currentCount = account.passwordResetRequestsCount || 0;

  // Reset counter if it's a new day
  if (lastResetDate !== today) {
    currentCount = 0;
  }

  // Check if user has reached the daily limit (5 requests)
  if (currentCount >= 5) {
    throw new AppError(
      "You have reached the daily limit for password reset requests. Please try again tomorrow.",
      429
    );
  }

  // Generate a 6-digit recovery code
  const recoveryCode = Math.floor(100000 + Math.random() * 900000).toString();

  // Update account with recovery code and increment request count
  await Account.findByIdAndUpdate(account._id, {
    recoveryCode,
    passwordResetRequestsCount: currentCount + 1,
    passwordResetLastResetDate: phTime,
  });

  // Send email with recovery code
  try {
    await sendPasswordResetEmail(email, recoveryCode, account.firstName);
  } catch (error) {
    // If email fails, still don't reveal account existence
    console.error("Error sending password reset email:", error);
    // Continue - we'll still return success to prevent email enumeration
  }

  res.status(200).json({
    message:
      "If an account with that email exists, a password reset code has been sent.",
  });
};

export const resetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, code, newPassword } = req.body;

  if (!email) {
    throw new AppError("Email is required.", 400);
  }
  if (!code) {
    throw new AppError("Recovery code is required.", 400);
  }
  if (!newPassword) {
    throw new AppError("New password is required.", 400);
  }

  // Find account by email
  const account = await findAccountS({ email });
  if (!account) {
    throw new AppError("Invalid recovery code or email.", 400);
  }

  // Verify recovery code
  if (!account.recoveryCode || account.recoveryCode !== code) {
    throw new AppError("Invalid recovery code or email.", 400);
  }

  // Check if code is expired (5 minutes)
  const codeAge = Date.now() - (account.updatedAt?.getTime() || 0);
  const fiveMinutes = 5 * 60 * 1000;
  if (codeAge > fiveMinutes) {
    // Clear expired recovery code from database
    await Account.findByIdAndUpdate(account._id, {
      recoveryCode: "",
    });
    throw new AppError(
      "Recovery code has expired. Please request a new one.",
      400
    );
  }

  // Hash new password
  const hashedPassword = await hashPassword(newPassword);

  // Get current date in Asia/Manila timezone
  const timeZone = "Asia/Manila";
  const now = new Date();
  const phTime = toZonedTime(now, timeZone);

  // Update password, clear recovery code, and disable forgot-password for the rest of the day
  // by setting passwordResetRequestsCount to 5 (the daily limit)
  await Account.findByIdAndUpdate(account._id, {
    password: hashedPassword,
    recoveryCode: "", // Empty the recovery code
    passwordResetRequestsCount: 5, // Set to limit to disable forgot-password for the day
    passwordResetLastResetDate: phTime, // Update to current date
  });

  res.status(200).json({
    message:
      "Password has been reset successfully. You can now login with your new password.",
  });
};
