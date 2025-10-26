import axiosInstance from "@/axios/axiosInstance";
import type {
  InvestmentCategoryType,
  InvestmentType,
} from "@/types/investment/investment.type";

// Investments Category
export const getCategoriesApi = async () =>
  await axiosInstance.get("/investment/category/all");

export const createCategoriesApi = async (
  categories: InvestmentCategoryType[]
) => {
  return await axiosInstance.post("/investment/category/create", {
    categories,
  });
};

export const updateCategoryApi = async (
  categoryId: string,
  updatedCategory: InvestmentCategoryType
) =>
  await axiosInstance.put("/investment/category/update", {
    categoryId,
    ...updatedCategory,
  });

export const deleteCategoryApi = async (categoryId: string) =>
  await axiosInstance.delete(`/investment/category/delete/${categoryId}`);

// Investments
export const getInvestmentsApi = async (skip = 0, limit = 20) =>
  await axiosInstance.get(`/investment/all?skip=${skip}&limit=${limit}`);

export const addInvestmentApi = async (data: Partial<InvestmentType>) =>
  await axiosInstance.post("/investment/add", data);

export const updateInvestmentApi = async (
  id: string,
  data: Partial<InvestmentType>
) => await axiosInstance.patch(`/investment/update/${id}`, data);

export const deleteInvestmentApi = async (id: string) =>
  await axiosInstance.delete(`/investment/delete/${id}`);
