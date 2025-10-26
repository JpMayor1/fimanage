import {
  getDashboardDataApi,
  updateBalanceApi,
} from "@/api/dashboard/dashboard.api";
import type { DashboardStoreType } from "@/types/dashboard/dashboard.type";
import { showError } from "@/utils/error/error.util";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useDashboardStore = create<DashboardStoreType>((set) => ({
  balance: 0,
  dailyExpense: [],
  totalIncomes: [],
  totalExpenses: [],
  totalSavings: [],
  totalInvestments: [],

  getLoading: false,
  updateLoading: false,

  getDashboardData: async () => {
    set({ getLoading: true });
    try {
      const response = await getDashboardDataApi();
      set({
        balance: response.data.balance,
        dailyExpense: response.data.dailyExpense,
        totalIncomes: response.data.totalIncomes,
        totalExpenses: response.data.totalExpenses,
        totalSavings: response.data.totalSavings,
        totalInvestments: response.data.totalInvestments,
      });
      return response.data.balance | 0;
    } catch (error) {
      console.error("Error getting data", error);
      showError(error);
      return 0;
    } finally {
      set({ getLoading: false });
    }
  },
  updateBalance: async (balance) => {
    set({ updateLoading: true });
    try {
      const response = await updateBalanceApi(balance);
      set({ balance });
      toast.success(response.data.message);
      return true;
    } catch (error) {
      showError(error);
      return false;
    } finally {
      set({ updateLoading: false });
    }
  },
}));
