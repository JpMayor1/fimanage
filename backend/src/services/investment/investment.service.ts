import Investment from "@/models/investment.model";
import InvestmentCategory from "@/models/investmentCategory.model";
import { AccountDocumentType } from "@/types/models/account.type";
import { InvestmentType } from "@/types/models/investment.type";
import {
  InvestmentCategoryFilterType,
  InvestmentCategoryType,
} from "@/types/models/investmentCategory.type";
import { getPhDt } from "@/utils/date&time/getPhDt";
import { AppError } from "@/utils/error/appError";

// Investment Category
export const findInvestmentCategoryS = async (
  filter: InvestmentCategoryFilterType
): Promise<InvestmentCategoryType | null> => {
  try {
    const investmentCategory = await InvestmentCategory.findOne(filter).exec();
    return investmentCategory as InvestmentCategoryType | null;
  } catch (err) {
    console.error("Error finding investment category:", err);
    return null;
  }
};

export const getCategoriesS = async (userId: string) =>
  await InvestmentCategory.find({ userId }).lean();

export const createInvestmentCategoryS = async (
  categories: InvestmentCategoryType[]
) => {
  const newCategories = await InvestmentCategory.insertMany(categories);
  return newCategories as InvestmentCategoryType[];
};

export const updateCategoryS = async (
  categoryId: string,
  updateData: { name?: string }
) => {
  return await InvestmentCategory.findByIdAndUpdate(
    categoryId,
    { $set: updateData },
    { new: true }
  );
};

export const deleteCategoryS = async (categoryId: string) =>
  await InvestmentCategory.findByIdAndDelete(categoryId);

// Investment
export const getInvestmentsS = async (
  userId: string,
  skip: number,
  limit: number
) => {
  const total = await Investment.countDocuments({ userId });
  const investments = await Investment.find({ userId })
    .sort({ createdAt: -1 })
    .skip(Number(skip))
    .limit(Number(limit))
    .lean();

  return { investments, total };
};

export const addInvestmentS = async (
  account: AccountDocumentType,
  data: Partial<InvestmentType>
) => {
  const category = await InvestmentCategory.findOne({ name: data.category });
  if (!category) throw new AppError("Category not found", 404);
  const newInvestment = await Investment.create({
    ...data,
    dt: getPhDt(),
  });
  if (data.amount && data.amount > 0) {
    account.balance += Number(data.amount);
    await account.save();
  }
  return newInvestment;
};

export const updateInvestmentS = async (
  account: AccountDocumentType,
  id: string,
  data: Partial<InvestmentType>
) => {
  const investment = await Investment.findById(id);
  if (!investment) throw new AppError("Investment not found", 404);

  if (investment.userId.toString() !== account._id.toString()) {
    throw new AppError("Unauthorized investment update", 403);
  }

  if (data.category) {
    const category = await InvestmentCategory.findOne({ name: data.category });
    if (!category) throw new AppError("Category not found", 404);
  }

  if (data.amount !== undefined) {
    const oldAmount = investment.amount;
    const newAmount = data.amount;

    const diff = Number(newAmount) - Number(oldAmount);

    if (diff !== 0) {
      account.balance += diff;
      await account.save();
    }
  }

  Object.assign(investment, data, { dt: getPhDt() });
  await investment.save();

  return investment.toObject();
};

export const deleteInvestmentS = async (id: string) => {
  const deletedInvestment = await Investment.findByIdAndDelete(id);
  if (!deletedInvestment) throw new AppError("Investment not found", 404);
  return deletedInvestment;
};
