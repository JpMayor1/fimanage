import { createIncomeCategory } from "@/controllers/income/income.controller";
import { Router } from "express";

const router = Router();

router.post("/create", createIncomeCategory);

export default router;
