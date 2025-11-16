import {
  addExpense,
  deleteExpense,
  getExpenses,
  getSources,
  updateExpense,
  updateLimit,
} from "@/controllers/expense/expense.controller";
import verifier from "@/middlewares/verifier";
import { Router } from "express";

const router = Router();

router.get("/all", verifier, getExpenses);
router.get("/sources", verifier, getSources);
router.post("/add", verifier, addExpense);
router.patch("/update/:id", verifier, updateExpense);
router.delete("/delete/:id", verifier, deleteExpense);

// Limit
router.patch("/limit/update", verifier, updateLimit);

export default router;
