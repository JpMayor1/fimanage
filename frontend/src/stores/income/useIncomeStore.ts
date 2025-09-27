import { createCategoriesApi } from "@/api/income/income.api";
import type { incomeStoreType } from "@/types/income/income.type";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useIncomeStore = create<incomeStoreType>((set) => ({
  categories: [],

  createCategoryLoading: false,

  createCategories: async (names) => {
    set({ createCategoryLoading: true });
    try {
      const response = await createCategoriesApi(names);
      set({ categories: response.data.incomeCategories });
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
      set({ createCategoryLoading: false });
    }
  },
}));
