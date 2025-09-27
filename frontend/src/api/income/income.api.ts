import axiosInstance from "@/axios/axiosInstance";

export const createCategoriesApi = async (names: string[]) =>
  await axiosInstance.post("/income/create", { names });
