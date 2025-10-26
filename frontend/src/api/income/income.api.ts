import axiosInstance from "@/axios/axiosInstance";
import type {
  IncomeCategoryType,
  IncomeType,
} from "@/types/income/income.type";

// Income Category
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

// Income
export const getIncomesApi = async (skip = 0, limit = 20) =>
  await axiosInstance.get(`/income/all?skip=${skip}&limit=${limit}`);

export const addIncomeApi = async (data: Partial<IncomeType>) =>
  await axiosInstance.post("/income/add", data);

export const updateIncomeApi = async (id: string, data: Partial<IncomeType>) =>
  await axiosInstance.patch(`/income/update/${id}`, data);

export const deleteIncomeApi = async (id: string) =>
  await axiosInstance.delete(`/income/delete/${id}`);
