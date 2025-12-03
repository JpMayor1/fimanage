import { loginApi, logoutApi, registerApi } from "@/api/auth/auth.api";
import { verifierSilentApi } from "@/api/verifier/verifierSilent.api";
import type { AuthStateType } from "@/types/auth/auth.type";
import { showError } from "@/utils/error/error.util";
import { create } from "zustand";

export const useAuthStore = create<AuthStateType>((set) => ({
  loading: false,
  isAuthenticated: null, // null = checking, true = authenticated, false = unauthenticated

  // Check auth status silently
  checkAuth: async () => {
    const status = await verifierSilentApi();
    set({ isAuthenticated: status === "authenticated" });
    return status === "authenticated";
  },

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
      await registerApi({
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
      // After registration, check auth status
      await useAuthStore.getState().checkAuth();
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
      await loginApi({ username, password });
      // After login, update auth status
      await useAuthStore.getState().checkAuth();
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
      // After logout, update auth status
      set({ isAuthenticated: false });
      return true;
    } catch (error) {
      console.error("Error logging out", error);
      showError(error);
      return false;
    } finally {
      set({ loading: false });
    }
  },
}));
