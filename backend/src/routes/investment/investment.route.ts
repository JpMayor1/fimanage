import {
  addInvestment,
  createInvestmentCategory,
  deleteCategory,
  deleteInvestment,
  getCategories,
  getInvestments,
  updateCategory,
  updateInvestment,
} from "@/controllers/investment/investment.controller";
import verifier from "@/middlewares/verifier";
import { Router } from "express";

const router = Router();
// Investment Category
router.get("/category/all", verifier, getCategories);
router.post("/category/create", verifier, createInvestmentCategory);
router.put("/category/update", verifier, updateCategory);
router.delete("/category/delete/:categoryId", verifier, deleteCategory);

// Investment
router.get("/all", verifier, getInvestments);
router.post("/add", verifier, addInvestment);
router.patch("/update/:id", verifier, updateInvestment);
router.delete("/delete/:id", verifier, deleteInvestment);

export default router;
