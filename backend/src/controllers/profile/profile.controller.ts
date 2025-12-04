import Account from "@/models/account.model";
import { updateProfileS } from "@/services/profile/profile.service";
import { CustomRequest } from "@/types/express/express.type";
import { comparePassword, hashPassword } from "@/utils/bcrypt/bcrypt";
import { AppError } from "@/utils/error/appError";
import { Response } from "express";

export const updateProfile = async (req: CustomRequest, res: Response) => {
  const { profile } = req.body;

  const updatedProfile = await updateProfileS(profile);
  if (!updateProfile) throw new AppError("Error updating profile.", 400);
  res
    .status(200)
    .json({ message: "Profile updated successfully.", updatedProfile });
};

export const changePassword = async (req: CustomRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.account._id;

  if (!currentPassword) {
    throw new AppError("Current password is required.", 400);
  }
  if (!newPassword) {
    throw new AppError("New password is required.", 400);
  }
  if (newPassword.length < 6) {
    throw new AppError("New password must be at least 6 characters long.", 400);
  }

  // Find account by userId
  const account = await Account.findById(userId);
  if (!account) {
    throw new AppError("Account not found.", 404);
  }

  // Verify current password
  const isPasswordCorrect = await comparePassword(
    currentPassword,
    account.password || ""
  );
  if (!isPasswordCorrect) {
    throw new AppError("Current password is incorrect.", 401);
  }

  // Hash new password
  const hashedPassword = await hashPassword(newPassword);

  // Update password
  await Account.findByIdAndUpdate(userId, {
    password: hashedPassword,
  });

  res.status(200).json({
    message: "Password has been changed successfully.",
  });
};
