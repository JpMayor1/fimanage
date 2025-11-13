import {
  addIncome,
  createIncomeCategory,
  deleteCategory,
  deleteIncome,
  getCategories,
  getIncomes,
  getIncomeSelection,
  updateCategory,
  updateIncome,
} from "@/controllers/income/income.controller";
import verifier from "@/middlewares/verifier";
import { Router } from "express";

const router = Router();

router.get("/selection/all", verifier, getIncomeSelection);

// Income Category
router.get("/category/all", verifier, getCategories);
router.post("/category/create", verifier, createIncomeCategory);
router.put("/category/update", verifier, updateCategory);
router.delete("/category/delete/:categoryId", verifier, deleteCategory);

// income
router.get("/all", verifier, getIncomes);
router.post("/add", verifier, addIncome);
router.patch("/update/:id", verifier, updateIncome);
router.delete("/delete/:id", verifier, deleteIncome);

export default router;
