import {
  addincome,
  createIncomeCategory,
  deleteCategory,
  getCategories,
  getIncomes,
  updateCategory,
} from "@/controllers/income/income.controller";
import verifier from "@/middlewares/verifier";
import { Router } from "express";

const router = Router();
// Income Category
router.get("/category/all", verifier, getCategories);
router.post("/category/create", verifier, createIncomeCategory);
router.put("/category/update", verifier, updateCategory);
router.delete("/category/delete/:categoryId", verifier, deleteCategory);

// income
router.get("/all", verifier, getIncomes);
router.post("/add", verifier, addincome);

export default router;
