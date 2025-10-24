import axiosInstance from "@/axios/axiosInstance";

export const getDashboardDataApi = async () =>
  axiosInstance.get("/dashboard/all");

export const updateBalanceApi = async (balance: number) =>
  axiosInstance.patch("/dashboard/balance/update", { balance });
