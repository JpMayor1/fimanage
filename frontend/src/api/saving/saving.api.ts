import axiosInstance from "@/axios/axiosInstance";
import type { SavingType } from "@/types/saving/saving.type";

export const getSavingsApi = async (skip = 0, limit = 20) =>
  await axiosInstance.get(`/saving/all?skip=${skip}&limit=${limit}`);

export const addSavingApi = async (data: Partial<SavingType>) =>
  await axiosInstance.post("/saving/add", data);

export const updateSavingApi = async (id: string, data: Partial<SavingType>) =>
  await axiosInstance.patch(`/saving/update/${id}`, data);

export const deleteSavingApi = async (id: string) =>
  await axiosInstance.delete(`/saving/delete/${id}`);
