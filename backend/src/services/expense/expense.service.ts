import Account from "@/models/account.model";
import Expense from "@/models/expense.model";
import Investment from "@/models/investment.model";
import Saving from "@/models/saving.model";
import { AccountDocumentType } from "@/types/models/account.type";
import { ExpenseType } from "@/types/models/expense.type";
import { getPhDt } from "@/utils/date&time/getPhDt";
import { AppError } from "@/utils/error/appError";

export const getExpensesS = async (
  userId: string,
  skip: number,
  limit: number
) => {
  const total = await Expense.countDocuments({ userId });
  const expenses = await Expense.find({ userId })
    .sort({ createdAt: -1 })
    .skip(Number(skip))
    .limit(Number(limit))
    .lean();

  return { expenses, total };
};

export const getSourcesS = async (userId: string) => {
  const [savings, investments] = await Promise.all([
    Saving.find({ userId }).select("_id name").lean(),
    Investment.find({ userId }).select("_id name").lean(),
  ]);
  return { savings, investments };
};

export const addExpenseS = async (
  account: AccountDocumentType,
  data: Partial<ExpenseType>
) => {
  const amount = Number(data.amount) || 0;
  const savingId = (data.savingId || "").trim();
  const investmentId = (data.investmentId || "").trim();

  const newExpense = await Expense.create({
    ...data,
    dt: getPhDt(),
  });

  if (amount > 0) {
    account.balance = Math.max(0, account.balance - amount);
    await account.save();

    if (savingId) {
      await Saving.findByIdAndUpdate(savingId, { $inc: { amount: -amount } });
    }

    if (investmentId) {
      await Investment.findByIdAndUpdate(investmentId, {
        $inc: { amount: -amount },
      });
    }
  }

  return newExpense;
};

export const updateExpenseS = async (
  account: AccountDocumentType,
  id: string,
  data: Partial<ExpenseType>
) => {
  const expense = await Expense.findById(id);
  if (!expense) throw new AppError("Expense not found", 404);

  const oldAmount = Number(expense.amount || 0);
  const newAmount = data.amount !== undefined ? Number(data.amount) : oldAmount;

  const oldSavingId = (expense.savingId || "").trim();
  const oldInvestmentId = (expense.investmentId || "").trim();

  const newSavingId = (data.savingId ?? expense.savingId ?? "")
    .toString()
    .trim();
  const newInvestmentId = (data.investmentId ?? expense.investmentId ?? "")
    .toString()
    .trim();

  const reverseOps: Promise<any>[] = [];

  if (oldSavingId) {
    reverseOps.push(
      Saving.findByIdAndUpdate(oldSavingId, {
        $inc: { amount: oldAmount },
      }).exec()
    );
  } else if (oldInvestmentId) {
    reverseOps.push(
      Investment.findByIdAndUpdate(oldInvestmentId, {
        $inc: { amount: oldAmount },
      }).exec()
    );
  }
  if (reverseOps.length) await Promise.all(reverseOps);

  account.balance += oldAmount;

  account.balance = Math.max(0, account.balance - newAmount);
  await account.save();

  const applyOps: Promise<any>[] = [];

  if (newSavingId) {
    applyOps.push(
      Saving.findByIdAndUpdate(newSavingId, {
        $inc: { amount: -newAmount },
      }).exec()
    );
  } else if (newInvestmentId) {
    applyOps.push(
      Investment.findByIdAndUpdate(newInvestmentId, {
        $inc: { amount: -newAmount },
      }).exec()
    );
  }

  if (applyOps.length) await Promise.all(applyOps);

  const updatedExpense = await Expense.findByIdAndUpdate(
    id,
    {
      ...data,
      savingId: newSavingId,
      investmentId: newInvestmentId,
      dt: getPhDt(),
    },
    { new: true }
  ).lean();

  return updatedExpense;
};

export const deleteExpenseS = async (
  account: AccountDocumentType,
  id: string
) => {
  const deletedExpense = await Expense.findByIdAndDelete(id);
  if (!deletedExpense) throw new AppError("Expense not found", 404);

  account.balance += deletedExpense.amount;
  await account.save();

  return deletedExpense;
};

// Limit
export const updateLimitS = async (userId: string, limit: number) =>
  await Account.findByIdAndUpdate(userId, { limit });
