import Investment from "@/models/investment.model";
import InvestmentCategory from "@/models/investmentCategory.model";
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
export const getInvestmentsS = async (userId: string) =>
  await Investment.find({ userId }).lean();

export const addInvestmentS = async (data: Partial<InvestmentType>) => {
  const category = await InvestmentCategory.findOne({ name: data.category });
  if (!category) throw new AppError("Category not found", 404);
  const newInvestment = await Investment.create({
    ...data,
    dt: getPhDt(),
  });
  return newInvestment;
};

export const updateInvestmentS = async (
  id: string,
  data: Partial<InvestmentType>
) => {
  const investment = await Investment.findById(id);
  if (!investment) throw new AppError("Investment not found", 404);

  if (data.category) {
    const category = await InvestmentCategory.findOne({ name: data.category });
    if (!category) throw new AppError("Category not found", 404);
  }

  const updatedInvestment = await Investment.findByIdAndUpdate(
    id,
    { ...data, dt: getPhDt() },
    { new: true }
  ).lean();

  return updatedInvestment;
};

export const deleteInvestmentS = async (id: string) => {
  const deletedInvestment = await Investment.findByIdAndDelete(id);
  if (!deletedInvestment) throw new AppError("Investment not found", 404);
  return deletedInvestment;
};
