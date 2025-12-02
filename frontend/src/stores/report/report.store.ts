import { getReportDataApi } from "@/api/report/report.api";
import type { ReportStoreType } from "@/types/report/report.type";
import { showError } from "@/utils/error/error.util";
import { create } from "zustand";

export const useReportStore = create<ReportStoreType>((set, get) => ({
  reportData: null,
  getLoading: false,
  period: "month",

  setPeriod: (period) => {
    set({ period });
  },

  getReportData: async () => {
    const { period } = get();
    set({ getLoading: true });
    try {
      const response = await getReportDataApi(period);
      set({
        reportData: response.data,
      });
    } catch (error) {
      console.error("Error getting report data", error);
      showError(error);
    } finally {
      set({ getLoading: false });
    }
  },
}));

