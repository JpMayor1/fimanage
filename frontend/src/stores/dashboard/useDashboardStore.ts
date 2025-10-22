import { getDashboardDataApi } from "@/api/dashboard/dashboard.api";
import type { DashboardStoreType } from "@/types/dashboard/dashboard.type";
import { showError } from "@/utils/error/error.util";
import { create } from "zustand";

export const useDashboardStore = create<DashboardStoreType>((set) => ({
  totalIncomes: [],
  totalExpenses: [],
  totalSavings: [],
  totalInvestments: [],

  getLoading: false,

  getDashboardData: async () => {
    set({ getLoading: true });
    try {
      const response = await getDashboardDataApi();
      set({
        totalIncomes: response.data.totalIncomes,
        totalExpenses: response.data.totalExpenses,
        totalSavings: response.data.totalSavings,
        totalInvestments: response.data.totalInvestments,
      });
    } catch (error) {
      console.error("Error getting data", error);
      showError(error);
    } finally {
      set({ getLoading: false });
    }
  },
}));
