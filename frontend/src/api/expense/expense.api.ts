import axiosInstance from "@/axios/axiosInstance";
import type { ExpenseCategoryType } from "@/types/expense/expense.type";

// Expense Category
export const getCategoriesApi = async () =>
  await axiosInstance.get("/expense/category/all");

export const createCategoriesApi = async (
  categories: ExpenseCategoryType[]
) => {
  return await axiosInstance.post("/expense/category/create", { categories });
};

export const updateCategoryApi = async (
  categoryId: string,
  updatedCategory: ExpenseCategoryType
) =>
  await axiosInstance.put("/expense/category/update", {
    categoryId,
    ...updatedCategory,
  });

export const deleteCategoryApi = async (categoryId: string) =>
  await axiosInstance.delete(`/expense/category/delete/${categoryId}`);
