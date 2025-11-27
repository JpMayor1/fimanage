import axiosInstance from "@/axios/axiosInstance";

export async function initCSRF() {
  try {
    const res = await axiosInstance.get("/csrf-token");
    const token = res.data.csrfToken;

    // Store token in default headers
    axiosInstance.defaults.headers.common["X-CSRF-Token"] = token;
  } catch (err) {
    console.error("Failed to initialize CSRF token:", err);
  }
}
