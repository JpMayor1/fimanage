import {
  addInvestmentApi,
  deleteInvestmentApi,
  getInvestmentsApi,
  updateInvestmentApi,
} from "@/api/investment/investment.api";
import type { InvestmentStoreType } from "@/types/investment/investment.type";
import { showError } from "@/utils/error/error.util";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useInvestmentStore = create<InvestmentStoreType>((set, get) => ({
  investments: [],

  hasMore: true,
  page: 0,

  getLoading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,

  getInvestments: async (append = false) => {
    const { page, investments } = get();
    const limit = 20;
    const skip = append ? page * limit : 0;

    set({ getLoading: true });
    try {
      const response = await getInvestmentsApi(skip, limit);
      const { investments: newInvestments, total } = response.data;
      const merged = append
        ? [...investments, ...newInvestments]
        : newInvestments;

      set({
        investments: merged,
        hasMore: merged.length < total,
        page: append ? page + 1 : 1,
      });
    } catch (error) {
      console.error("Error getting investments", error);
      showError(error);
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
      showError(error);
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
      showError(error);
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
      showError(error);
      return false;
    } finally {
      set({ deleteLoading: false });
    }
  },
}));
