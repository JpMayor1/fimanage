// import { initCSRF } from "@/utils/csrf/csrf.util";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  timeout: 300000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // 1. Only retry once
//     if (originalRequest._retry) {
//       return Promise.reject(error);
//     }

//     // 2. Only refresh CSRF on 403 errors
//     if (error.response?.status === 403) {
//       // 3. Do not refresh CSRF for the CSRF route itself
//       if (originalRequest.url?.includes("/csrf-token")) {
//         return Promise.reject(error);
//       }

//       originalRequest._retry = true; // 4. Mark as retried

//       // 5. Refresh CSRF token
//       await initCSRF();

//       // 6. Retry original request
//       return axiosInstance(originalRequest);
//     }

//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
