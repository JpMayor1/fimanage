import {
  addSavingApi,
  createCategoriesApi,
  deleteCategoryApi,
  deleteSavingApi,
  getCategoriesApi,
  getSavingsApi,
  updateCategoryApi,
  updateSavingApi,
} from "@/api/saving/saving.api";
import type {
  SavingCategoryType,
  SavingStoreType,
} from "@/types/saving/saving.type";
import { showError } from "@/utils/error/error.util";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useSavingStore = create<SavingStoreType>((set) => ({
  categories: [],
  savings: [],

  getLoading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,

  // Saving Category
  getCategories: async () => {
    set({ getLoading: true });
    try {
      const response = await getCategoriesApi();
      set({ categories: response.data.categories });
    } catch (error) {
      console.error("Error getting categories", error);
      showError(error);
    } finally {
      set({ getLoading: false });
    }
  },

  createCategories: async (categories: SavingCategoryType[]) => {
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
      showError(error);
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
      showError(error);
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
      showError(error);
      return false;
    } finally {
      set({ deleteLoading: false });
    }
  },

  // Saving
  getSavings: async () => {
    set({ getLoading: true });
    try {
      const response = await getSavingsApi();
      set({ savings: response.data.savings });
    } catch (error) {
      console.error("Error getting savings", error);
      showError(error);
    } finally {
      set({ getLoading: false });
    }
  },
  addSaving: async (data) => {
    set({ createLoading: true });
    try {
      const response = await addSavingApi(data);
      set((state) => ({
        savings: [...state.savings, response.data.newSaving],
      }));
      toast.success(response.data.message);
      return true;
    } catch (error) {
      console.error("Error adding saving", error);
      showError(error);
      return false;
    } finally {
      set({ createLoading: false });
    }
  },
  updateSaving: async (id, data) => {
    set({ updateLoading: true });
    try {
      const response = await updateSavingApi(id, data);
      set((state) => ({
        savings: state.savings.map((saving) =>
          saving._id === id
            ? { ...saving, ...response.data.updatedSaving }
            : saving
        ),
      }));
      toast.success(response.data.message);
      return true;
    } catch (error) {
      console.error("Error updating saving", error);
      showError(error);
      return false;
    } finally {
      set({ updateLoading: false });
    }
  },
  deleteSaving: async (id) => {
    set({ deleteLoading: true });
    try {
      const response = await deleteSavingApi(id);
      set((state) => ({
        savings: state.savings.filter((saving) => saving._id !== id),
      }));
      toast.success(response.data.message);
      return true;
    } catch (error) {
      console.error("Error deleting saving", error);
      showError(error);
      return false;
    } finally {
      set({ deleteLoading: false });
    }
  },
}));
