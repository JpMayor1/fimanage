import Balance from "@/models/balance.model";
import Income from "@/models/income.model";
import IncomeCategory from "@/models/incomeCategory.model";
import { IncomeType } from "@/types/models/income.type";
import {
  IncomeCategoryFilterType,
  IncomeCategoryType,
} from "@/types/models/IncomeCategoryType";
import { getPhDt } from "@/utils/date&time/getPhDt";
import { AppError } from "@/utils/error/appError";

export const getIncomeSelectionS = async (userId: string) => {
  const categories = await IncomeCategory.find({ userId }).lean();
  const balances = await Balance.find({ userId }).lean();
  return { categories, balances };
};

// Income Category
export const findIncomeCategoryS = async (
  filter: IncomeCategoryFilterType
): Promise<IncomeCategoryType | null> => {
  try {
    const incomeCategory = await IncomeCategory.findOne(filter).exec();
    return incomeCategory as IncomeCategoryType | null;
  } catch (err) {
    console.error("Error finding income category:", err);
    return null;
  }
};

export const getCategoriesS = async (userId: string) =>
  await IncomeCategory.find({ userId }).lean();

export const createIncomeCategoryS = async (
  categories: IncomeCategoryType[]
) => {
  const newCategories = await IncomeCategory.insertMany(categories);
  return newCategories as IncomeCategoryType[];
};

export const updateCategoryS = async (
  categoryId: string,
  updateData: { name?: string; icon?: string }
) => {
  return await IncomeCategory.findByIdAndUpdate(
    categoryId,
    { $set: updateData },
    { new: true }
  );
};

export const deleteCategoryS = async (categoryId: string) =>
  await IncomeCategory.findByIdAndDelete(categoryId);

// Income
export const getIncomesS = async (
  userId: string,
  skip: number,
  limit: number
) => {
  const total = await Income.countDocuments({ userId });
  const incomes = await Income.find({ userId })
    .sort({ createdAt: -1 })
    .skip(Number(skip))
    .limit(Number(limit))
    .lean();

  return { incomes, total };
};

export const addIncomeS = async (data: Partial<IncomeType>) => {
  const category = await IncomeCategory.findOne({ name: data.category });
  if (!category) throw new AppError("Category not found", 404);

  const balance = await Balance.findById(data.balanceId);
  if (!balance) throw new AppError("Balance not found", 404);

  const newIncome = await Income.create({
    ...data,
    icon: category.icon,
    dt: getPhDt(),
  });

  if (data.amount && data.amount > 0) {
    balance.amount += Number(data.amount);
    await balance.save();
  }

  return newIncome;
};

export const updateIncomeS = async (id: string, data: Partial<IncomeType>) => {
  const income = await Income.findById(id);
  if (!income) throw new AppError("Income not found", 404);

  if (data.category) {
    const category = await IncomeCategory.findOne({ name: data.category });
    if (!category) throw new AppError("Category not found", 404);
    data.icon = category.icon;
  }

  // Handle balance amount adjustment if amount or balanceId changed
  if (data.amount !== undefined || data.balanceId !== undefined) {
    const oldBalance = await Balance.findById(income.balanceId);
    if (!oldBalance) throw new AppError("Old balance not found", 404);

    const newBalanceId = data.balanceId || income.balanceId;
    const newBalance = await Balance.findById(newBalanceId);
    if (!newBalance) throw new AppError("New balance not found", 404);

    const oldAmount = income.amount;
    const newAmount = data.amount ?? oldAmount;

    // If the balance source is the same, just adjust the difference
    if (oldBalance._id === newBalance._id) {
      const diff = Number(newAmount) - Number(oldAmount);
      if (diff !== 0) {
        await Balance.findByIdAndUpdate(
          newBalance._id,
          { $inc: { amount: diff } },
          { new: true }
        );
      }
    } else {
      // If balance source changed, revert old balance and add to new one
      await Promise.all([
        Balance.findByIdAndUpdate(oldBalance._id, {
          $inc: { amount: -oldAmount },
        }),
        Balance.findByIdAndUpdate(newBalance._id, {
          $inc: { amount: newAmount },
        }),
      ]);
    }
  }

  // Finally, update the income itself
  const updatedIncome = await Income.findByIdAndUpdate(
    id,
    { ...data, dt: getPhDt() },
    { new: true }
  ).lean();

  return updatedIncome;
};

export const deleteIncomeS = async (id: string) => {
  const deletedIncome = await Income.findByIdAndDelete(id);
  if (!deletedIncome) throw new AppError("Income not found", 404);

  const { balanceId, amount } = deletedIncome;

  if (balanceId && amount && amount > 0) {
    await Balance.findByIdAndUpdate(
      balanceId,
      { $inc: { amount: -amount } },
      { new: true }
    );
  }

  return deletedIncome;
};
