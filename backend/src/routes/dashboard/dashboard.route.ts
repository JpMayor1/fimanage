import {
  getDashboardData,
  updateBalance,
} from "@/controllers/dashboard/dashboard.controller";
import verifier from "@/middlewares/verifier.middleware";
import { Router } from "express";

const router = Router();

router.get("/all", verifier, getDashboardData);
router.patch("/balance/update", verifier, updateBalance);

export default router;
