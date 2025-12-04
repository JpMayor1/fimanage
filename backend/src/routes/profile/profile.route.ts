import { updateProfile } from "@/controllers/profile/profile.controller";
import verifier from "@/middlewares/verifier.middleware";
import { asyncHandler } from "@/utils/asyncHandler/asyncHandler";
import { Router } from "express";

const router = Router();

router.patch("/update", verifier, asyncHandler(updateProfile));

export default router;
