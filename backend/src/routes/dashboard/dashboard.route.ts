import { getDashboardData } from "@/controllers/dashboard/dashboard.controller";
import verifier from "@/middlewares/verifier.middleware";
import { Router } from "express";

const router = Router();

router.get("/all", verifier, getDashboardData);

export default router;
