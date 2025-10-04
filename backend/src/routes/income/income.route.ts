import {
  createIncomeCategory,
  deleteCategory,
  getCategories,
  getIncomes,
  updateCategory,
} from "@/controllers/income/income.controller";
import { Router } from "express";

const router = Router();
// Income Category
router.get("/category/all", getCategories);
router.post("/category/create", createIncomeCategory);
router.put("/category/update", updateCategory);
router.delete("/category/delete/:categoryId", deleteCategory);

// income
router.get("/all", getIncomes);

export default router;
