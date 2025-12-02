import { getReportData } from "@/controllers/report/report.controller";
import verifier from "@/middlewares/verifier.middleware";
import { Router } from "express";

const router = Router();

router.get("/data", verifier, getReportData);

export default router;

