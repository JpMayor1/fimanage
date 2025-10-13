import {
  createSavingCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "@/controllers/savings/savings.controller";
import verifier from "@/middlewares/verifier";
import { Router } from "express";

const router = Router();
// Saving Category
router.get("/category/all", verifier, getCategories);
router.post("/category/create", verifier, createSavingCategory);
router.put("/category/update", verifier, updateCategory);
router.delete("/category/delete/:categoryId", verifier, deleteCategory);

// Saving

export default router;
