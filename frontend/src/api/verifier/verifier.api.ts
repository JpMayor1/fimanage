import axiosInstance from "@/axios/axiosInstance";

export const verifierApi = async () => {
  const response = await axiosInstance.get("/verifier");
  return response;
};
