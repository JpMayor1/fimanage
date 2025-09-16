import axiosInstance from "@/axios/axiosInstance";
import type { RegisterAccountType } from "@/types/auth/auth.type";

export const registerApi = async ({
  name,
  email,
  username,
  password,
  address,
}: RegisterAccountType) => {
  const response = await axiosInstance.post("/auth/admin/register", {
    name,
    email,
    username,
    password,
    address,
  });
  return response;
};

export const loginApi = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  const response = await axiosInstance.post("/auth/admin/login", {
    username,
    password,
  });
  return response;
};

export const logoutApi = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response;
};
