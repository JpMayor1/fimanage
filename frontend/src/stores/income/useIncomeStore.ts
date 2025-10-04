import {
  createCategoriesApi,
  deleteCategoryApi,
  getCategoriesApi,
  getIncomesApi,
  updateCategoryApi,
} from "@/api/income/income.api";
import type {
  IncomeCategoryType,
  incomeStoreType,
} from "@/types/income/income.type";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useIncomeStore = create<incomeStoreType>((set) => ({
  categories: [],
  incomes: [],

  getLoading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,

  // Income Category
  getCategories: async () => {
    set({ getLoading: true });
    try {
      const response = await getCategoriesApi();
      set({ categories: response.data.categories });
    } catch (error) {
      console.error("Error getting categories", error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      set({ getLoading: false });
    }
  },

  createCategories: async (categories: IncomeCategoryType[]) => {
    set({ createLoading: true });
    try {
      const response = await createCategoriesApi(categories);
      set((state) => ({
        categories: [...state.categories, ...response.data.newCategories],
      }));
      toast.success(response.data.message);
      return true;
    } catch (error) {
      console.error("Error creating categories", error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
      return false;
    } finally {
      set({ createLoading: false });
    }
  },

  updateCategory: async (categoryId, updatedCategory) => {
    set({ updateLoading: true });
    try {
      const response = await updateCategoryApi(categoryId, updatedCategory);
      set((state) => ({
        categories: state.categories.map((c) =>
          c._id === categoryId ? { ...c, ...updatedCategory } : c
        ),
      }));
      toast.success(response.data.message);
      return true;
    } catch (error) {
      console.error("Error updating category", error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
      return false;
    } finally {
      set({ updateLoading: false });
    }
  },

  deleteCategory: async (categoryId) => {
    set({ deleteLoading: true });
    try {
      const response = await deleteCategoryApi(categoryId);
      set((state) => ({
        categories: state.categories.filter((c) => c._id !== categoryId),
      }));
      toast.success(response.data.message);
      return true;
    } catch (error) {
      console.error("Error deleting category", error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
      return false;
    } finally {
      set({ deleteLoading: false });
    }
  },

  // Income
  getIncomes: async () => {
    set({ getLoading: true });
    try {
      const response = await getIncomesApi();
      set({ incomes: response.data.incomes });
    } catch (error) {
      console.error("Error getting incomes", error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      set({ getLoading: false });
    }
  },
}));
