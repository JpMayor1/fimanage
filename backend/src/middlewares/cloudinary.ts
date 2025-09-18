import { v2 as cloudinary } from "cloudinary";
import express, { Request, Response } from "express";

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.get("/cloudinary-signature", (req: Request, res: Response) => {
  const timestamp = Math.round(new Date().getTime() / 1000);

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET },
    process.env.CLOUDINARY_API_SECRET as string
  );

  res.json({ timestamp, signature });
});

export default router;
