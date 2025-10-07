import {
  addExpense,
  createExpenseCategory,
  deleteCategory,
  deleteExpense,
  getCategories,
  getExpenses,
  updateCategory,
  updateExpense,
} from "@/controllers/expense/expense.controller";
import verifier from "@/middlewares/verifier";
import { Router } from "express";

const router = Router();
// Expense Category
router.get("/category/all", verifier, getCategories);
router.post("/category/create", verifier, createExpenseCategory);
router.put("/category/update", verifier, updateCategory);
router.delete("/category/delete/:categoryId", verifier, deleteCategory);

// Expense
router.get("/all", verifier, getExpenses);
router.post("/add", verifier, addExpense);
router.patch("/update/:id", verifier, updateExpense);
router.delete("/delete/:id", verifier, deleteExpense);

export default router;
