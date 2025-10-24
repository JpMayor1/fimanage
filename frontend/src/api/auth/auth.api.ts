import axiosInstance from "@/axios/axiosInstance";
import type { AccountType } from "@/types/auth/auth.type";
import { uploadFile } from "@/utils/file/uploadFile";

export const registerApi = async ({
  profilePicture,
  firstName,
  middleName,
  lastName,
  suffix,
  email,
  username,
  password,
  address,
}: Partial<AccountType>) => {
  let default_secure_url = "";
  let default_public_id = "";
  if (profilePicture) {
    const { secure_url, public_id } = await uploadFile(profilePicture as File);
    default_public_id = public_id;
    default_secure_url = secure_url;
  }

  const response = await axiosInstance.post("/auth/admin/register", {
    publicId: default_public_id,
    profilePicture: default_secure_url,
    firstName,
    middleName,
    lastName,
    suffix,
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
