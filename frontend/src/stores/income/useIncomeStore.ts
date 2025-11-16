import {
  addIncomeApi,
  deleteIncomeApi,
  getIncomesApi,
  updateIncomeApi,
} from "@/api/income/income.api";
import type { IncomeStoreType } from "@/types/income/income.type";
import { showError } from "@/utils/error/error.util";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useIncomeStore = create<IncomeStoreType>((set, get) => ({
  incomes: [],

  hasMore: true,
  page: 0,

  getLoading: false,
  loading: false,

  getIncomes: async (append = false) => {
    const { page, incomes } = get();
    const limit = 20;
    const skip = append ? page * limit : 0;

    if (get().getLoading || !get().hasMore) return;

    set({ getLoading: true });

    try {
      const response = await getIncomesApi(skip, limit);
      const { incomes: newIncomes, total } = response.data;

      const merged = append ? [...incomes, ...newIncomes] : newIncomes;

      set({
        incomes: merged,
        hasMore: merged.length < total,
        page: append ? page + 1 : 1,
      });
    } catch (error) {
      showError(error);
    } finally {
      set({ getLoading: false });
    }
  },
  addIncome: async (data) => {
    set({ loading: true });
    try {
      const response = await addIncomeApi(data);
      set((state) => ({
        incomes: [...state.incomes, response.data.newIncome],
      }));
      toast.success(response.data.message);
      return true;
    } catch (error) {
      console.error("Error adding income", error);
      showError(error);
      return false;
    } finally {
      set({ loading: false });
    }
  },
  updateIncome: async (id, data) => {
    set({ loading: true });
    try {
      const response = await updateIncomeApi(id, data);
      set((state) => ({
        incomes: state.incomes.map((income) =>
          income._id === id
            ? { ...income, ...response.data.updatedIncome }
            : income
        ),
      }));
      toast.success(response.data.message);
      return true;
    } catch (error) {
      console.error("Error updating income", error);
      showError(error);
      return false;
    } finally {
      set({ loading: false });
    }
  },
  deleteIncome: async (id) => {
    set({ loading: true });
    try {
      const response = await deleteIncomeApi(id);
      set((state) => ({
        incomes: state.incomes.filter((income) => income._id !== id),
      }));
      toast.success(response.data.message);
      return true;
    } catch (error) {
      console.error("Error deleting income", error);
      showError(error);
      return false;
    } finally {
      set({ loading: false });
    }
  },
}));
