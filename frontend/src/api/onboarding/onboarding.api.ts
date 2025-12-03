import axiosInstance from "@/axios/axiosInstance";

export const completeOnboardingPageApi = async (page: string) => {
  const response = await axiosInstance.post("/onboarding/complete", { page });
  return response;
};

