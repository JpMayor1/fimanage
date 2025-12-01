import axiosInstance from "@/axios/axiosInstance";
import type { ReceivingType } from "@/types/receiving/receiving.type";

export const getReceivingsApi = async (skip = 0, limit = 20) =>
  await axiosInstance.get(`/receiving/all?skip=${skip}&limit=${limit}`);

export const addReceivingApi = async (data: Partial<ReceivingType>) =>
  await axiosInstance.post("/receiving/add", data);

export const updateReceivingApi = async (
  id: string,
  data: Partial<ReceivingType>
) => await axiosInstance.patch(`/receiving/update/${id}`, data);

export const deleteReceivingApi = async (id: string) =>
  await axiosInstance.delete(`/receiving/delete/${id}`);
