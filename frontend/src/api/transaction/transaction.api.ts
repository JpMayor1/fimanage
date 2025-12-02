import axiosInstance from "@/axios/axiosInstance";
import type { TransactionType } from "@/types/transaction/transaction.type";

export const getTransactionsApi = async (
  skip = 0,
  limit = 20,
  type?: TransactionType["type"]
) => {
  const typeQuery = type ? `&type=${type}` : "";
  return await axiosInstance.get(
    `/transaction/all?skip=${skip}&limit=${limit}${typeQuery}`
  );
};

export const addTransactionApi = async (data: Partial<TransactionType>) =>
  await axiosInstance.post("/transaction/add", data);

export const updateTransactionApi = async (
  id: string,
  data: Partial<TransactionType>
) => await axiosInstance.patch(`/transaction/update/${id}`, data);

export const deleteTransactionApi = async (id: string) =>
  await axiosInstance.delete(`/transaction/delete/${id}`);



