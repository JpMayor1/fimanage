import axiosInstance from "@/axios/axiosInstance";
import type {
  SavingCategoryType,
  SavingType,
} from "@/types/saving/saving.type";

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
export const getSavingsApi = async (skip = 0, limit = 20) =>
  await axiosInstance.get(`/saving/all?skip=${skip}&limit=${limit}`);

export const addSavingApi = async (data: Partial<SavingType>) =>
  await axiosInstance.post("/saving/add", data);

export const updateSavingApi = async (id: string, data: Partial<SavingType>) =>
  await axiosInstance.patch(`/saving/update/${id}`, data);

export const deleteSavingApi = async (id: string) =>
  await axiosInstance.delete(`/saving/delete/${id}`);
