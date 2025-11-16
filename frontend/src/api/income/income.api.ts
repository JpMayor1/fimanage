import axiosInstance from "@/axios/axiosInstance";
import type { IncomeType } from "@/types/income/income.type";

export const getIncomesApi = async (skip = 0, limit = 20) =>
  await axiosInstance.get(`/income/all?skip=${skip}&limit=${limit}`);

export const addIncomeApi = async (data: Partial<IncomeType>) =>
  await axiosInstance.post("/income/add", data);

export const updateIncomeApi = async (id: string, data: Partial<IncomeType>) =>
  await axiosInstance.patch(`/income/update/${id}`, data);

export const deleteIncomeApi = async (id: string) =>
  await axiosInstance.delete(`/income/delete/${id}`);
