import axiosInstance from "@/axios/axiosInstance";
import type { DeptType } from "@/types/dept/dept.type";

export const getDeptsApi = async (skip = 0, limit = 20) =>
  await axiosInstance.get(`/dept/all?skip=${skip}&limit=${limit}`);

export const addDeptApi = async (data: Partial<DeptType>) =>
  await axiosInstance.post("/dept/add", data);

export const updateDeptApi = async (id: string, data: Partial<DeptType>) =>
  await axiosInstance.patch(`/dept/update/${id}`, data);

export const deleteDeptApi = async (id: string) =>
  await axiosInstance.delete(`/dept/delete/${id}`);
