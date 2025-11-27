import { verifierApi } from "@/api/verifier/verifier.api";
import type { AccountStoreType } from "@/types/account/account.type";
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
      return false;
    } finally {
      set({ loading: false });
    }
  },
}));
