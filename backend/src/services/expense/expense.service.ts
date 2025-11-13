import Account from "@/models/account.model";
import Balance from "@/models/balance.model";
import Expense from "@/models/expense.model";
import ExpenseCategory from "@/models/expenseCategory.model";
import { ExpenseType } from "@/types/models/expense.type";
import {
  ExpenseCategoryFilterType,
  ExpenseCategoryType,
} from "@/types/models/expenseCategoryType";
import { getPhDt } from "@/utils/date&time/getPhDt";
import { AppError } from "@/utils/error/appError";

export const getExpenseSelectionS = async (userId: string) => {
  const categories = await ExpenseCategory.find({ userId }).lean();
  const balances = await Balance.find({ userId }).lean();
  return { categories, balances };
};

// Expense Category
export const findExpenseCategoryS = async (
  filter: ExpenseCategoryFilterType
): Promise<ExpenseCategoryType | null> => {
  try {
    const expenseCategory = await ExpenseCategory.findOne(filter).exec();
    return expenseCategory as ExpenseCategoryType | null;
  } catch (err) {
    console.error("Error finding expense category:", err);
    return null;
  }
};

export const getCategoriesS = async (userId: string) =>
  await ExpenseCategory.find({ userId }).lean();

export const createExpenseCategoryS = async (
  categories: ExpenseCategoryType[]
) => {
  const newCategories = await ExpenseCategory.insertMany(categories);
  return newCategories as ExpenseCategoryType[];
};

export const updateCategoryS = async (
  categoryId: string,
  updateData: { name?: string; icon?: string }
) => {
  return await ExpenseCategory.findByIdAndUpdate(
    categoryId,
    { $set: updateData },
    { new: true }
  );
};

export const deleteCategoryS = async (categoryId: string) =>
  await ExpenseCategory.findByIdAndDelete(categoryId);

// Expense
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

export const addExpenseS = async (data: Partial<ExpenseType>) => {
  const category = await ExpenseCategory.findOne({ name: data.category });
  if (!category) throw new AppError("Category not found", 404);

  const balance = await Balance.findById(data.balanceId);
  if (!balance) throw new AppError("Balance not found", 404);

  const newExpense = await Expense.create({
    ...data,
    icon: category.icon,
    dt: getPhDt(),
  });

  if (data.amount && data.amount > 0) {
    balance.amount -= Number(data.amount);
    await balance.save();
  }

  return newExpense;
};

export const updateExpenseS = async (
  id: string,
  data: Partial<ExpenseType>
) => {
  const expense = await Expense.findById(id);
  if (!expense) throw new AppError("Expense not found", 404);

  if (data.category) {
    const category = await ExpenseCategory.findOne({ name: data.category });
    if (!category) throw new AppError("Category not found", 404);
    data.icon = category.icon;
  }

  // Handle balance adjustment if amount or balanceId changed
  if (data.amount !== undefined || data.balanceId !== undefined) {
    const oldBalance = await Balance.findById(expense.balanceId);
    if (!oldBalance) throw new AppError("Old balance not found", 404);

    const newBalanceId = data.balanceId || expense.balanceId;
    const newBalance = await Balance.findById(newBalanceId);
    if (!newBalance) throw new AppError("New balance not found", 404);

    const oldAmount = Number(expense.amount);
    const newAmount = Number(data.amount ?? oldAmount);

    if (oldBalance.id === newBalance.id) {
      const diff = newAmount - oldAmount;
      if (diff !== 0) {
        await Balance.findByIdAndUpdate(
          newBalance._id,
          { $inc: { amount: -diff } },
          { new: true }
        );
      }
    } else {
      await Promise.all([
        Balance.findByIdAndUpdate(oldBalance._id, {
          $inc: { amount: +oldAmount },
        }),
        Balance.findByIdAndUpdate(newBalance._id, {
          $inc: { amount: -newAmount },
        }),
      ]);
    }
  }

  const updatedExpense = await Expense.findByIdAndUpdate(
    id,
    { ...data, dt: getPhDt() },
    { new: true }
  ).lean();

  return updatedExpense;
};

export const deleteExpenseS = async (id: string) => {
  const deletedExpense = await Expense.findByIdAndDelete(id);
  if (!deletedExpense) throw new AppError("Expense not found", 404);

  const { balanceId, amount } = deletedExpense;

  if (balanceId && amount && amount > 0) {
    await Balance.findByIdAndUpdate(
      balanceId,
      { $inc: { amount: +amount } },
      { new: true }
    );
  }

  return deletedExpense;
};

// Limit
export const updateLimitS = async (userId: string, limit: number) =>
  await Account.findByIdAndUpdate(userId, { limit });
