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

export const useBalanceStore = create<BalanceStoreType>((set) => ({
  balances: [],

  getLoading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,

  // Balance
  getBalances: async () => {
    set({ getLoading: true });

    try {
      const response = await getBalancesApi();
      const { balances } = response.data;

      set({
        balances,
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
