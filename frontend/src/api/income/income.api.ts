import axiosInstance from "@/axios/axiosInstance";

export const getCategoriesApi = async () =>
  await axiosInstance.get("/income/categories/all");

export const createCategoriesApi = async (names: string[]) =>
  await axiosInstance.post("/income/create", { names });
