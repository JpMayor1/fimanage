import { createCategoriesApi, getCategoriesApi } from "@/api/income/income.api";
import type { incomeStoreType } from "@/types/income/income.type";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useIncomeStore = create<incomeStoreType>((set) => ({
  categories: [],

  getLoading: false,
  createLoading: false,

  getCategories: async () => {
    set({ getLoading: true });
    try {
      const response = await getCategoriesApi();
      set({ categories: response.data.categories });
    } catch (error) {
      console.error("Error getting categoriest", error);
      if (error instanceof AxiosError) {
        if (error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      set({ getLoading: false });
    }
  },
  createCategories: async (names) => {
    set({ createLoading: true });
    try {
      const response = await createCategoriesApi(names);
      set((state) => ({
        categories: [...state.categories, ...response.data.newCategories],
      }));
      toast.success(response.data.message);
      return true;
    } catch (error) {
      console.error("Error creating categoriest", error);
      if (error instanceof AxiosError) {
        if (error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error("An unexpected error occurred.");
      }
      return false;
    } finally {
      set({ createLoading: false });
    }
  },
}));
