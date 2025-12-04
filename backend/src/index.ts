import "source-map-support/register";

import dotenv from "dotenv";
dotenv.config();

import cookieParser from "cookie-parser";
import cors from "cors";
import csrf from "csurf";
import express from "express";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import http from "http";
import morgan from "morgan";

import initDB from "@/db/db.connect.js";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { globalRateLimiter } from "./middlewares/limit.middleware";

import authRoute from "@/routes/auth/auth.route";
import csrfRoute from "@/routes/csrf/csrf.route";
import verifierRoute from "@/routes/verifier/verifier.route";

import cloudinary from "@/middlewares/cloudinary";
import fileRoute from "@/routes/file/file.route";

import dashboardRoute from "@/routes/dashboard/dashboard.route";
import deptRoute from "@/routes/dept/dept.route";
import onboardingRoute from "@/routes/onboarding/onboarding.route";
import profileRoute from "@/routes/profile/profile.route";
import receivingRoute from "@/routes/receiving/receiving.route";
import reportRoute from "@/routes/report/report.route";
import sourceRoute from "@/routes/source/source.route";
import transactionRoute from "@/routes/transaction/transaction.route";

import { startDailyExpenseJob, startOverdueCheckJob } from "./jobs/jobs";

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason: Error | any, promise: Promise<any>) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
  console.error("Stack:", reason?.stack || "No stack trace available");
  // Don't exit the process, just log the error
});

// Handle uncaught exceptions
process.on("uncaughtException", (error: Error) => {
  console.error("❌ Uncaught Exception:", error);
  console.error("Stack:", error.stack);
  // Don't exit the process, just log the error
  // In production, you might want to exit after logging
  // but for development, we'll keep the server running
});

// Handle warnings
process.on("warning", (warning: Error) => {
  console.warn("⚠️ Warning:", warning.name);
  console.warn("Message:", warning.message);
  console.warn("Stack:", warning.stack);
});

const bootstrap = async () => {
  const app = express();
  app.set("trust proxy", 1);

  const PORT = process.env.PORT || 5000;
  const allowedOrigins = process.env.FRONTEND_URLS
    ? process.env.FRONTEND_URLS.split(",")
    : [];

  // CORS
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }

        // Reject everything else
        callback(new Error("CORS not allowed"), false);
      },
      credentials: true,
    })
  );

  // Security headers
  app.use(helmet());

  // Rate limiting
  app.use(globalRateLimiter);

  // Logger
  app.use(morgan("dev"));

  // JSON parser
  app.use(express.json());

  // Prevent NoSQL Injection
  app.use(mongoSanitize());

  // Cookie parser
  app.use(cookieParser());

  // CSRF protection
  app.use(
    csrf({
      cookie: {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      },
    })
  );

  // Log IP
  app.use((req, res, next) => {
    console.log("Client IP:", req.ip);
    next();
  });

  // Root
  app.get("/api/test", (req, res) => {
    res.status(200).send("Api is running");
  });

  // Routes
  app.use("/api/csrf-token", csrfRoute);
  app.use("/api/verifier", verifierRoute);
  app.use("/api/auth", authRoute);

  app.use("/api/cloudinary", cloudinary);
  app.use("/api/profile", profileRoute);
  app.use("/api/file", fileRoute);
  app.use("/api/dashboard", dashboardRoute);
  app.use("/api/source", sourceRoute);
  app.use("/api/dept", deptRoute);
  app.use("/api/receiving", receivingRoute);
  app.use("/api/transaction", transactionRoute);
  app.use("/api/report", reportRoute);
  app.use("/api/onboarding", onboardingRoute);

  app.use(globalErrorHandler);

  const server = http.createServer(app);
  server.setTimeout(300000);

  server.listen(PORT, () => {
    initDB().catch((err) => {
      console.error("❌ Database connection error:", err);
      // Don't exit, server can still run and retry connection
    });
    
    try {
      startDailyExpenseJob();
      startOverdueCheckJob();
    } catch (err) {
      console.error("❌ Error starting jobs:", err);
      // Don't exit, server can still run without jobs
    }
    
    console.log(`✅ Server Running on port ${PORT}`);
  });

  // Handle server errors
  server.on("error", (error: NodeJS.ErrnoException) => {
    if (error.syscall !== "listen") {
      throw error;
    }

    const bind = typeof PORT === "string" ? `Pipe ${PORT}` : `Port ${PORT}`;

    switch (error.code) {
      case "EACCES":
        console.error(`❌ ${bind} requires elevated privileges`);
        break;
      case "EADDRINUSE":
        console.error(`❌ ${bind} is already in use`);
        break;
      default:
        console.error(`❌ Server error:`, error);
    }
    // Don't exit, let the error handler deal with it
  });

  // Graceful shutdown
  const gracefulShutdown = (signal: string) => {
    console.log(`\n🛑 ${signal} received. Shutting down gracefully...`);
    server.close(() => {
      console.log("✅ HTTP server closed");
      process.exit(0);
    });

    // Force close after 10 seconds
    setTimeout(() => {
      console.error("❌ Forcing shutdown after timeout");
      process.exit(1);
    }, 10000);
  };

  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
};

bootstrap().catch((e) => {
  console.error("❌ Fatal boot error:", e);
  console.error("Stack:", e.stack);
  // Don't exit immediately, give it a chance to recover
  // Only exit if it's a critical error that prevents server from starting
  if (e.code === "EADDRINUSE" || e.code === "EACCES") {
    process.exit(1);
  }
  // For other errors, log and continue (server might still be usable)
});
