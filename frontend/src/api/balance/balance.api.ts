import axiosInstance from "@/axios/axiosInstance";
import type { BalanceType } from "@/types/balance/balance.type";

// Balance
export const getBalancesApi = async () =>
  await axiosInstance.get("/balance/all");

export const addBalanceApi = async (data: Partial<BalanceType>) =>
  await axiosInstance.post("/balance/add", data);

export const updateBalanceApi = async (
  id: string,
  data: Partial<BalanceType>
) => await axiosInstance.patch(`/balance/update/${id}`, data);

export const deleteBalanceApi = async (id: string) =>
  await axiosInstance.delete(`/balance/delete/${id}`);
