import {
  createExpenseCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "@/controllers/expense/expense.controller";
import verifier from "@/middlewares/verifier";
import { Router } from "express";

const router = Router();
// Expense Category
router.get("/category/all", verifier, getCategories);
router.post("/category/create", verifier, createExpenseCategory);
router.put("/category/update", verifier, updateCategory);
router.delete("/category/delete/:categoryId", verifier, deleteCategory);

export default router;
