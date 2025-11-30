import { getDashboardDataApi } from "@/api/dashboard/dashboard.api";
import type { DashboardStoreType } from "@/types/dashboard/dashboard.type";
import { showError } from "@/utils/error/error.util";
import { create } from "zustand";

export const useDashboardStore = create<DashboardStoreType>((set) => ({
  dailyExpense: [],

  getLoading: false,
  updateLoading: false,

  getDashboardData: async () => {
    set({ getLoading: true });
    try {
      const response = await getDashboardDataApi();
      set({
        dailyExpense: response.data.dailyExpense,
      });
    } catch (error) {
      console.error("Error getting data", error);
      showError(error);
    } finally {
      set({ getLoading: false });
    }
  },
}));
