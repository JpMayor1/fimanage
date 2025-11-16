import axiosInstance from "@/axios/axiosInstance";
import type { ExpenseType } from "@/types/expense/expense.type";

export const getExpensesApi = async (skip = 0, limit = 20) =>
  await axiosInstance.get(`/expense/all?skip=${skip}&limit=${limit}`);

export const getSourcesApi = async () =>
  await axiosInstance.get("/expense/sources");

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
