import axios from "axios";

export type AuthStatus = "authenticated" | "unauthenticated";

// Create a separate axios instance for silent verification that doesn't log errors
const silentAxios = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api`,
  withCredentials: true,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Suppress all error logging for silent verifier
silentAxios.interceptors.response.use(
  (response) => response,
  () => {
    // Silent error handling - return a rejected promise without logging
    return Promise.reject();
  }
);

export const verifierSilentApi = async (): Promise<AuthStatus> => {
  try {
    const response = await silentAxios.get("/verifier/silent");
    return response.data.authenticated ? "authenticated" : "unauthenticated";
  } catch {
    // Silent catch - no error logging, no exceptions thrown
    return "unauthenticated";
  }
};

