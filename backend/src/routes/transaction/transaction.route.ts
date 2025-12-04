import {
  addTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction,
} from "@/controllers/transaction/transaction.controller";
import verifier from "@/middlewares/verifier.middleware";
import { asyncHandler } from "@/utils/asyncHandler/asyncHandler";
import { Router } from "express";

const router = Router();

router.get("/all", verifier, asyncHandler(getTransactions));
router.post("/add", verifier, asyncHandler(addTransaction));
router.patch("/update/:id", verifier, asyncHandler(updateTransaction));
router.delete("/delete/:id", verifier, asyncHandler(deleteTransaction));

export default router;



