import { getReportData } from "@/controllers/report/report.controller";
import verifier from "@/middlewares/verifier.middleware";
import { asyncHandler } from "@/utils/asyncHandler/asyncHandler";
import { Router } from "express";

const router = Router();

router.get("/data", verifier, asyncHandler(getReportData));

export default router;

