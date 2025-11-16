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
    Saving.find({ userId }).lean(),
    Investment.find({ userId }).lean(),
  ]);
  return { savings, investments };
};

export const addExpenseS = async (
  account: AccountDocumentType,
  data: Partial<ExpenseType>
) => {
  const newExpense = await Expense.create({
    ...data,
    dt: getPhDt(),
  });

  if (data.amount && data.amount > 0) {
    account.balance = Math.max(0, account.balance - Number(data.amount));
    await account.save();
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

  if (data.amount !== undefined) {
    const oldAmount = expense.amount;
    const newAmount = data.amount;
    const difference = oldAmount - newAmount;

    account.balance += difference;
    await account.save();
  }

  const updatedExpense = await Expense.findByIdAndUpdate(
    id,
    { ...data, dt: getPhDt() },
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
