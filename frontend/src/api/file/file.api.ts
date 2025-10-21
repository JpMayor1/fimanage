import axiosInstance from "@/axios/axiosInstance";

export const deleteFileApi = async (publicId: string): Promise<boolean> => {
  try {
    const response = await axiosInstance.delete(
      `/file/delete-file/${encodeURIComponent(publicId)}`
    );
    return response.data.success;
  } catch (error) {
    console.error("Error deleting Cloudinary file:", error);
    return false;
  }
};
