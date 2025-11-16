import {
  addInvestment,
  deleteInvestment,
  getInvestments,
  updateInvestment,
} from "@/controllers/investment/investment.controller";
import verifier from "@/middlewares/verifier";
import { Router } from "express";

const router = Router();

router.get("/all", verifier, getInvestments);
router.post("/add", verifier, addInvestment);
router.patch("/update/:id", verifier, updateInvestment);
router.delete("/delete/:id", verifier, deleteInvestment);

export default router;
