import IncomeCategory from "@/models/IncomeCategory.model";
import {
  IncomeCategoryFilterType,
  IncomeCategoryType,
} from "@/types/models/IncomeCategoryType";

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

export const createIncomeCategoryS = async (names: string[]) => {
  const categories = names.map((name) => ({ name }));
  return await IncomeCategory.insertMany(categories);
};
