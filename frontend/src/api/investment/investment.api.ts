import axiosInstance from "@/axios/axiosInstance";
import type { InvestmentType } from "@/types/investment/investment.type";

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
