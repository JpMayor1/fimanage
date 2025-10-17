import axiosInstance from "@/axios/axiosInstance";

export const getDashboardDataApi = async () =>
  axiosInstance.get("/dashboard/all");
