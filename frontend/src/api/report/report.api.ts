import axiosInstance from "@/axios/axiosInstance";
import type { ReportPeriod } from "@/types/report/report.type";

export const getReportDataApi = async (period: ReportPeriod = "month") =>
  axiosInstance.get(`/report/data?period=${period}`);

