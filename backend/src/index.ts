import "source-map-support/register";

import dotenv from "dotenv";
dotenv.config();

import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import http from "http";
import morgan from "morgan";

import initDB from "@/db/db.connect.js";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";

const bootstrap = async () => {
  const app = express();
  const PORT = process.env.PORT || 5000;
  const allowedOrigins = process.env.FRONTEND_URLS
    ? JSON.parse(process.env.FRONTEND_URLS)
    : [];

  app.use(
    cors({
      origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
          callback(null, true);
        } else {
          callback(new Error("CORS not allowed"), false);
        }
      },
      credentials: true,
    })
  );
  app.use(morgan("dev"));
  app.use(express.json());
  app.use(cookieParser());

  app.get("/", (req, res) => {
    res.status(200).send("API is running");
  });

  app.use(globalErrorHandler);

  const server = http.createServer(app);
  server.setTimeout(300000);

  server.listen(PORT, () => {
    initDB();
    console.log(`Server Running on port ${PORT}`);
  });
};

bootstrap().catch((e) => {
  console.error("Fatal boot error:", e);
  process.exit(1);
});
