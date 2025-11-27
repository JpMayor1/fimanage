import axiosInstance from "@/axios/axiosInstance";
import type { AccountType } from "@/types/account/account.type";
import { uploadFile } from "@/utils/file/uploadFile";
import { deleteFileApi } from "../file/file.api";

export const updateProfileApi = async (profile: Partial<AccountType>) => {
  let publicId = profile.publicId || "";
  let profilePicture = profile.profilePicture || "";
  if (profile.newProfilePicture && profile.newProfilePicture instanceof File) {
    await deleteFileApi(publicId);
    const { secure_url, public_id } = await uploadFile(
      profile.newProfilePicture
    );
    profilePicture = secure_url;
    publicId = public_id;
  }
  const response = await axiosInstance.patch("/profile/update", {
    profile: { ...profile, publicId, profilePicture },
  });
  return response;
};
