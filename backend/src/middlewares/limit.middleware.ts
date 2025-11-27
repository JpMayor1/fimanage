import { rateLimit } from "express-rate-limit";

const toMs = (minutes: number) => minutes * 60 * 1000;

// Global limiter
export const globalRateLimiter = rateLimit({
  windowMs: toMs(Number(process.env.GLOBAL_RATE_LIMIT_MINUTES) || 15),
  max: Number(process.env.GLOBAL_RATE_LIMIT_MAX) || 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

// Auth limiter
export const authRateLimiter = rateLimit({
  windowMs: toMs(Number(process.env.AUTH_RATE_LIMIT_MINUTES) || 10),
  max: Number(process.env.AUTH_RATE_LIMIT_MAX) || 5,
  message: {
    message: "Too many attempts. Please try again later.",
  },
  standardHeaders: "draft-7",
  legacyHeaders: false,
});
