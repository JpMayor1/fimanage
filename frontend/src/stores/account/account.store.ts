import { updateProfileApi } from "@/api/profile/profile.api";
import { verifierApi } from "@/api/verifier/verifier.api";
import type { AccountStoreType } from "@/types/account/account.type";
import { showError } from "@/utils/error/error.util";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useAccountStore = create<AccountStoreType>((set) => ({
  account: null,

  loading: false,

  verify: async () => {
    set({ loading: true });
    try {
      const response = await verifierApi();
      set({ account: response.data.account });
      return true;
    } catch (error) {
      console.error("Error verifying account", error);
      showError(error);
      return false;
    } finally {
      set({ loading: false });
    }
  },
  updateProfile: async (profile) => {
    set({ loading: true });
    try {
      const response = await updateProfileApi(profile);
      set({ account: response.data.updatedProfile });
      toast.success(response.data.message);
      return true;
    } catch (error) {
      console.error("Error updating profile", error);
      showError(error);
      return false;
    } finally {
      set({ loading: false });
    }
  },
}));
