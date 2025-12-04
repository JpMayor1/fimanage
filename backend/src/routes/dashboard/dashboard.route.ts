import { getDashboardData } from "@/controllers/dashboard/dashboard.controller";
import verifier from "@/middlewares/verifier.middleware";
import { asyncHandler } from "@/utils/asyncHandler/asyncHandler";
import { Router } from "express";

const router = Router();

router.get("/all", verifier, asyncHandler(getDashboardData));

export default router;
