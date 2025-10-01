import {
  createIncomeCategory,
  getCategories,
} from "@/controllers/income/income.controller";
import { Router } from "express";

const router = Router();

router.get("/categories/all", getCategories);
router.post("/create", createIncomeCategory);

export default router;
