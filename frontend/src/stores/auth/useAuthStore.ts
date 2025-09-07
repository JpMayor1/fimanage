import { loginApi, logoutApi } from "@/api/auth/auth.api";
import type { AuthStateType } from "@/types/auth/auth.type";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useAuthStore = create(
  persist<AuthStateType>(
    (set) => ({
      authUser: null,

      registerLoading: false,
      loginLoading: false,
      logoutLoading: false,
      updateProfileLoading: false,

      loginAccount: async ({ username, password }) => {
        set({ loginLoading: true });
        try {
          const response = await loginApi({ username, password });
          set({ authUser: response.data.user });
          return true;
        } catch (error) {
          console.error("Error logging in account", error);
          if (error instanceof AxiosError) {
            if (error.response) {
              toast.error(error.response.data.message);
            } else {
              toast.error(error.message);
            }
          } else {
            toast.error("An unexpected error occurred.");
          }
          return false;
        } finally {
          set({ loginLoading: false });
        }
      },
      logout: async () => {
        set({ logoutLoading: true });
        try {
          await logoutApi();
          set({ authUser: null });
          sessionStorage.clear();
        } catch (error) {
          console.error("Error logging out", error);
          if (error instanceof AxiosError) {
            if (error.response) {
              toast.error(error.response.data.message);
            } else {
              toast.error(error.message);
            }
          } else {
            toast.error("An unexpected error occurred.");
          }
        } finally {
          set({ logoutLoading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
