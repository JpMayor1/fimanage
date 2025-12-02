import { getDashboardDataApi } from "@/api/dashboard/dashboard.api";
import type { DashboardStoreType } from "@/types/dashboard/dashboard.type";
import { showError } from "@/utils/error/error.util";
import { create } from "zustand";

export const useDashboardStore = create<DashboardStoreType>((set) => ({
  dailyExpense: [],
  summary: null,
  statistics: null,
  expenseTrend: [],
  transactionTypeDistribution: [],
  topSources: [],
  recentTransactions: [],

  getLoading: false,
  updateLoading: false,

  getDashboardData: async () => {
    set({ getLoading: true });
    try {
      const response = await getDashboardDataApi();
      set({
        dailyExpense: response.data.dailyExpense || [],
        summary: response.data.summary || null,
        statistics: response.data.statistics || null,
        expenseTrend: response.data.expenseTrend || [],
        transactionTypeDistribution:
          response.data.transactionTypeDistribution || [],
        topSources: response.data.topSources || [],
        recentTransactions: response.data.recentTransactions || [],
      });
    } catch (error) {
      console.error("Error getting data", error);
      showError(error);
    } finally {
      set({ getLoading: false });
    }
  },
}));
