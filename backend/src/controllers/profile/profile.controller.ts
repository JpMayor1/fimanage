import { updateProfileS } from "@/services/profile/profile.service";
import { CustomRequest } from "@/types/express/express.type";
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
