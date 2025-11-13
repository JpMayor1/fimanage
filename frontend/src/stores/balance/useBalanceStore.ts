import {
  addBalanceApi,
  deleteBalanceApi,
  getBalancesApi,
  updateBalanceApi,
} from "@/api/balance/balance.api";
import type { BalanceStoreType } from "@/types/balance/balance.type";
import { showError } from "@/utils/error/error.util";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useBalanceStore = create<BalanceStoreType>((set, get) => ({
  balances: [],

  hasMore: true,
  page: 0,

  getLoading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,

  // Balance
  getBalances: async (append = false) => {
    const { page, balances } = get();
    const limit = 20;
    const skip = append ? page * limit : 0;

    if (get().getLoading || !get().hasMore) return;

    set({ getLoading: true });

    try {
      const response = await getBalancesApi(skip, limit);
      const { balances: newBalances, total } = response.data;

      const merged = append ? [...balances, ...newBalances] : newBalances;

      set({
        balances: merged,
        hasMore: merged.length < total,
        page: append ? page + 1 : 1,
      });
    } catch (error) {
      showError(error);
    } finally {
      set({ getLoading: false });
    }
  },
  addBalance: async (data) => {
    set({ createLoading: true });
    try {
      const response = await addBalanceApi(data);
      set((state) => ({
        balances: [...state.balances, response.data.newBalance],
      }));
      toast.success(response.data.message);
      return true;
    } catch (error) {
      console.error("Error adding balance", error);
      showError(error);
      return false;
    } finally {
      set({ createLoading: false });
    }
  },
  updateBalance: async (id, data) => {
    set({ updateLoading: true });
    try {
      const response = await updateBalanceApi(id, data);
      set((state) => ({
        balances: state.balances.map((balance) =>
          balance._id === id
            ? { ...balance, ...response.data.updatedBalance }
            : balance
        ),
      }));
      toast.success(response.data.message);
      return true;
    } catch (error) {
      console.error("Error updating balance", error);
      showError(error);
      return false;
    } finally {
      set({ updateLoading: false });
    }
  },
  deleteBalance: async (id) => {
    set({ deleteLoading: true });
    try {
      const response = await deleteBalanceApi(id);
      set((state) => ({
        balances: state.balances.filter((balance) => balance._id !== id),
      }));
      toast.success(response.data.message);
      return true;
    } catch (error) {
      console.error("Error deleting balance", error);
      showError(error);
      return false;
    } finally {
      set({ deleteLoading: false });
    }
  },
}));
