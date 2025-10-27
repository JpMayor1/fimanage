import { loginApi, logoutApi, registerApi } from "@/api/auth/auth.api";
import { updateProfileApi } from "@/api/profile/profile.api";
import type { AuthStateType } from "@/types/auth/auth.type";
import { showError } from "@/utils/error/error.util";
import toast from "react-hot-toast";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useAuthStore = create(
  persist<AuthStateType>(
    (set) => ({
      authUser: null,

      loading: false,

      registerccount: async ({
        profilePicture,
        firstName,
        middleName,
        lastName,
        suffix,
        email,
        username,
        password,
        address,
      }) => {
        set({ loading: true });
        try {
          const response = await registerApi({
            profilePicture,
            firstName,
            middleName,
            lastName,
            suffix,
            email,
            username,
            password,
            address,
          });
          set({ authUser: response.data.user });
          return true;
        } catch (error) {
          console.error("Error registering in account", error);
          showError(error);
          return false;
        } finally {
          set({ loading: false });
        }
      },
      loginAccount: async ({ username, password }) => {
        set({ loading: true });
        try {
          const response = await loginApi({ username, password });
          set({ authUser: response.data.user });
          return true;
        } catch (error) {
          console.error("Error logging in account", error);
          showError(error);
          return false;
        } finally {
          set({ loading: false });
        }
      },
      logout: async () => {
        set({ loading: true });
        try {
          await logoutApi();
          set({ authUser: null });
          localStorage.clear();
          sessionStorage.clear();
        } catch (error) {
          console.error("Error logging out", error);
          showError(error);
        } finally {
          set({ loading: false });
        }
      },
      updateProfile: async (profile) => {
        set({ loading: true });
        try {
          const response = await updateProfileApi(profile);
          set({ authUser: response.data.updatedProfile });
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
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
