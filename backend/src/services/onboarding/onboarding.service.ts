import Account from "@/models/account.model";
import { AppError } from "@/utils/error/appError";

export const completeOnboardingPageS = async (
  accountId: string,
  page: string
) => {
  const account = await Account.findById(accountId);
  if (!account) throw new AppError("Account not found", 404);

  const completedPages = account.completedOnboardingPages || [];
  if (!completedPages.includes(page)) {
    completedPages.push(page);
    await Account.findByIdAndUpdate(accountId, {
      completedOnboardingPages: completedPages,
    });
  }

  return { completedOnboardingPages: completedPages };
};

