import axios from "axios";

const PING_INTERVAL = 14 * 60 * 1000; // 14 minutes

let started = false;

export function startBackendKeepAlive() {
  // Prevent multiple intervals (important!)
  if (started) return;
  started = true;

  // Run immediately
  pingBackend();

  // Run every 14 minutes
  setInterval(() => {
    pingBackend();
  }, PING_INTERVAL);
}

async function pingBackend() {
  try {
    await axios.get(`${import.meta.env.VITE_API_URL}/api/test`);
    console.log("[keep-alive] backend pinged");
  } catch (err) {
    // Do NOT throw — keep-alive must never break the app
    console.warn("[keep-alive] ping failed", err);
  }
}
