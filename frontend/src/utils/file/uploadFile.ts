import axiosInstance from "@/axios/axiosInstance";
import axios from "axios";

interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
}

export const uploadFile = async (
  file: File
): Promise<CloudinaryUploadResponse> => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  // 1. Get signature & timestamp from backend
  const { data } = await axiosInstance.get("/cloudinary/cloudinary-signature");
  const { signature, timestamp } = data;

  // 2. Build FormData
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("timestamp", timestamp.toString());
  formData.append("signature", signature);
  formData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);

  // 3. Upload to Cloudinary
  const response = await axios.post(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  return {
    secure_url: response.data.secure_url,
    public_id: response.data.public_id,
  };
};
