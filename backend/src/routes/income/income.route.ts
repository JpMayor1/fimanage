import {
  addIncome,
  deleteIncome,
  getIncomes,
  updateIncome,
} from "@/controllers/income/income.controller";
import verifier from "@/middlewares/verifier";
import { Router } from "express";

const router = Router();

router.get("/all", verifier, getIncomes);
router.post("/add", verifier, addIncome);
router.patch("/update/:id", verifier, updateIncome);
router.delete("/delete/:id", verifier, deleteIncome);

export default router;
