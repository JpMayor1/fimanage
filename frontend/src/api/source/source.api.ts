import axiosInstance from "@/axios/axiosInstance";
import type { SourceType } from "@/types/source/source.type";

export const getSourcesApi = async (skip = 0, limit = 20) =>
  await axiosInstance.get(`/source/all?skip=${skip}&limit=${limit}`);

export const addSourceApi = async (data: Partial<SourceType>) =>
  await axiosInstance.post("/source/add", data);

export const updateSourceApi = async (id: string, data: Partial<SourceType>) =>
  await axiosInstance.patch(`/source/update/${id}`, data);

export const deleteSourceApi = async (id: string) =>
  await axiosInstance.delete(`/source/delete/${id}`);
