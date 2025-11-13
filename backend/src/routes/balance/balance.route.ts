import {
  addBalance,
  deleteBalance,
  getBalances,
  updateBalance,
} from "@/controllers/balance/balance.controller";
import verifier from "@/middlewares/verifier";
import { Router } from "express";

const router = Router();

router.get("/all", verifier, getBalances);
router.post("/add", verifier, addBalance);
router.patch("/update/:id", verifier, updateBalance);
router.delete("/delete/:id", verifier, deleteBalance);

export default router;
