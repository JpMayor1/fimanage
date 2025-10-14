import {
  addInvestmentApi,
  createCategoriesApi,
  deleteCategoryApi,
  deleteInvestmentApi,
  getCategoriesApi,
  getInvestmentsApi,
  updateCategoryApi,
  updateInvestmentApi,
} from "@/api/investment/investment.api";
import type {
  InvestmentCategoryType,
  InvestmentStoreType,
} from "@/types/investment/investment.type";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useInvestmentStore = create<InvestmentStoreType>((set) => ({
  categories: [],
  investments: [],

  getLoading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,

  // Investment Category
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

  createCategories: async (categories: InvestmentCategoryType[]) => {
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

  // Investment
  getInvestments: async () => {
    set({ getLoading: true });
    try {
      const response = await getInvestmentsApi();
      set({ investments: response.data.investments });
    } catch (error) {
      console.error("Error getting investments", error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      set({ getLoading: false });
    }
  },
  addInvestment: async (data) => {
    set({ createLoading: true });
    try {
      const response = await addInvestmentApi(data);
      set((state) => ({
        investments: [...state.investments, response.data.newInvestment],
      }));
      toast.success(response.data.message);
      return true;
    } catch (error) {
      console.error("Error adding investment", error);
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
  updateInvestment: async (id, data) => {
    set({ updateLoading: true });
    try {
      const response = await updateInvestmentApi(id, data);
      set((state) => ({
        investments: state.investments.map((investment) =>
          investment._id === id
            ? { ...investment, ...response.data.updatedInvestment }
            : investment
        ),
      }));
      toast.success(response.data.message);
      return true;
    } catch (error) {
      console.error("Error updating investment", error);
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
  deleteInvestment: async (id) => {
    set({ deleteLoading: true });
    try {
      const response = await deleteInvestmentApi(id);
      set((state) => ({
        investments: state.investments.filter(
          (investment) => investment._id !== id
        ),
      }));
      toast.success(response.data.message);
      return true;
    } catch (error) {
      console.error("Error deleting investment", error);
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
}));
