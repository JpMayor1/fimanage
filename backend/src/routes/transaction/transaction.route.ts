import {
  addTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction,
} from "@/controllers/transaction/transaction.controller";
import verifier from "@/middlewares/verifier.middleware";
import { Router } from "express";

const router = Router();

router.get("/all", verifier, getTransactions);
router.post("/add", verifier, addTransaction);
router.patch("/update/:id", verifier, updateTransaction);
router.delete("/delete/:id", verifier, deleteTransaction);

export default router;



