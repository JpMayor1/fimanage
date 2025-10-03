import axiosInstance from "@/axios/axiosInstance";
import type { IncomeCategoryType } from "@/types/income/income.type";

export const getCategoriesApi = async () =>
  await axiosInstance.get("/income/category/all");

export const createCategoriesApi = async (categories: IncomeCategoryType[]) => {
  return await axiosInstance.post("/income/category/create", { categories });
};

export const updateCategoryApi = async (
  categoryId: string,
  updatedCategory: IncomeCategoryType
) =>
  await axiosInstance.put("/income/category/update", {
    categoryId,
    ...updatedCategory,
  });

export const deleteCategoryApi = async (categoryId: string) =>
  await axiosInstance.delete(`/income/category/delete/${categoryId}`);
