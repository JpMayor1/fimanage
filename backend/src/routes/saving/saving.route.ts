import {
  addSaving,
  createSavingCategory,
  deleteCategory,
  deleteSaving,
  getCategories,
  getSavings,
  updateCategory,
  updateSaving,
} from "@/controllers/saving/saving.controller";
import verifier from "@/middlewares/verifier";
import { Router } from "express";

const router = Router();
// Saving Category
router.get("/category/all", verifier, getCategories);
router.post("/category/create", verifier, createSavingCategory);
router.put("/category/update", verifier, updateCategory);
router.delete("/category/delete/:categoryId", verifier, deleteCategory);

// Saving
router.get("/all", verifier, getSavings);
router.post("/add", verifier, addSaving);
router.patch("/update/:id", verifier, updateSaving);
router.delete("/delete/:id", verifier, deleteSaving);

export default router;
