import { loginApi, logoutApi, registerApi } from "@/api/auth/auth.api";
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

      registerccount: async ({ name, email, username, password, address }) => {
        set({ registerLoading: true });
        try {
          const response = await registerApi({
            name,
            email,
            username,
            password,
            address,
          });
          set({ authUser: response.data.user });
          return true;
        } catch (error) {
          console.error("Error registering in account", error);
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
          set({ registerLoading: false });
        }
      },
      loginAccount: async ({ username, password }) => {
        set({ loginLoading: true });
        try {
          const response = await loginApi({ username, password });
          set({ authUser: response.data.user });
          return true;
        } catch (error) {
          console.error("Error loging in account", error);
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
