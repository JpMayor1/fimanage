import axiosInstance from "@/axios/axiosInstance";

export const getCategoriesApi = async () =>
  await axiosInstance.get("/income/category/all");

export const createCategoriesApi = async (names: string[]) =>
  await axiosInstance.post("/income/category/create", { names });

export const updateCategoryApi = async (categoryId: string, newName: string) =>
  await axiosInstance.put("/income/category/update", { categoryId, newName });

export const deleteCategoryApi = async (categoryId: string) =>
  await axiosInstance.delete(`/income/category/delete/${categoryId}`);
