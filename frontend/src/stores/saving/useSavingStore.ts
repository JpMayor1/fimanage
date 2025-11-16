import {
  addSavingApi,
  deleteSavingApi,
  getSavingsApi,
  updateSavingApi,
} from "@/api/saving/saving.api";
import type { SavingStoreType } from "@/types/saving/saving.type";
import { showError } from "@/utils/error/error.util";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useSavingStore = create<SavingStoreType>((set, get) => ({
  savings: [],

  hasMore: true,
  page: 0,

  getLoading: false,
  loading: false,

  getSavings: async (append = false) => {
    const { page, savings } = get();
    const limit = 20;
    const skip = append ? page * limit : 0;

    set({ getLoading: true });
    try {
      const response = await getSavingsApi(skip, limit);
      const { savings: newSavings, total } = response.data;

      const merged = append ? [...savings, ...newSavings] : newSavings;

      set({
        savings: merged,
        hasMore: merged.length < total,
        page: append ? page + 1 : 1,
      });
    } catch (error) {
      console.error("Error getting savings", error);
      showError(error);
    } finally {
      set({ getLoading: false });
    }
  },
  addSaving: async (data) => {
    set({ loading: true });
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
      set({ loading: false });
    }
  },
  updateSaving: async (id, data) => {
    set({ loading: true });
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
      set({ loading: false });
    }
  },
  deleteSaving: async (id) => {
    set({ loading: true });
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
      set({ loading: false });
    }
  },
}));
