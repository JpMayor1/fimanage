import { completeOnboardingPageS } from "@/services/onboarding/onboarding.service";
import { CustomRequest } from "@/types/express/express.type";
import { AppError } from "@/utils/error/appError";
import { Response } from "express";

export const completeOnboardingPage = async (
  req: CustomRequest,
  res: Response
) => {
  const { page } = req.body;
  const accountId = req.account?._id;

  if (!accountId) throw new AppError("Unauthorized", 401);
  if (!page) throw new AppError("Page is required", 400);

  const result = await completeOnboardingPageS(accountId, page);
  res.status(200).json({
    message: "Onboarding page marked as completed",
    completedOnboardingPages: result.completedOnboardingPages,
  });
};

