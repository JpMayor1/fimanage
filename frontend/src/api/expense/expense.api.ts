import axiosInstance from "@/axios/axiosInstance";
import type {
  ExpenseCategoryType,
  ExpenseType,
} from "@/types/expense/expense.type";

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

// Expense
export const getExpensesApi = async (skip = 0, limit = 20) =>
  await axiosInstance.get(`/expense/all?skip=${skip}&limit=${limit}`);

export const addExpenseApi = async (data: Partial<ExpenseType>) =>
  await axiosInstance.post("/expense/add", data);

export const updateExpenseApi = async (
  id: string,
  data: Partial<ExpenseType>
) => await axiosInstance.patch(`/expense/update/${id}`, data);

export const deleteExpenseApi = async (id: string) =>
  await axiosInstance.delete(`/expense/delete/${id}`);

// Limit
export const updateLimitApi = async (limit: number) =>
  await axiosInstance.patch("/expense/limit/update", { limit });
