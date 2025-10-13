import axiosInstance from "@/axios/axiosInstance";
import type { SavingCategoryType } from "@/types/savings/savings.type";

// Savings Category
export const getCategoriesApi = async () =>
  await axiosInstance.get("/saving/category/all");

export const createCategoriesApi = async (categories: SavingCategoryType[]) => {
  return await axiosInstance.post("/saving/category/create", { categories });
};

export const updateCategoryApi = async (
  categoryId: string,
  updatedCategory: SavingCategoryType
) =>
  await axiosInstance.put("/saving/category/update", {
    categoryId,
    ...updatedCategory,
  });

export const deleteCategoryApi = async (categoryId: string) =>
  await axiosInstance.delete(`/saving/category/delete/${categoryId}`);

// Savings
