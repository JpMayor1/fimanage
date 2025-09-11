import axiosInstance from "@/axios/axiosInstance";

export const registerApi = async ({
  profilePicture,
  name,
  email,
  username,
  password,
  address,
}: {
  profilePicture: File;
  name: string;
  email: string;
  username: string;
  password: string;
  address: string;
}) => {
  const fd = new FormData();

  fd.append("profilePicture", profilePicture);
  fd.append("name", name);
  fd.append("email", email);
  fd.append("username", username);
  fd.append("password", password);
  fd.append("address", address);

  const response = await axiosInstance.post("/auth/admin/register", fd, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
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
