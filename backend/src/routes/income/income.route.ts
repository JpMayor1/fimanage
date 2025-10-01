import {
  createIncomeCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "@/controllers/income/income.controller";
import { Router } from "express";

const router = Router();

router.get("/category/all", getCategories);
router.post("/category/create", createIncomeCategory);
router.put("/category/update", updateCategory);
router.delete("/category/delete/:categoryId", deleteCategory);

export default router;
