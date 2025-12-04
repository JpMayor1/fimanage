import { deleteFileC } from "@/controllers/file/file.controler";
import verifier from "@/middlewares/verifier.middleware";
import { asyncHandler } from "@/utils/asyncHandler/asyncHandler";
import { Router } from "express";

const router = Router();

router.delete("/delete-file/:publicId", verifier, asyncHandler(deleteFileC));

export default router;
