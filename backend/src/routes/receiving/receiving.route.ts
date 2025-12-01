import {
  addReceiving,
  deleteReceiving,
  getReceivings,
  updateReceiving,
} from "@/controllers/receiving/receiving.controller";
import verifier from "@/middlewares/verifier.middleware";
import { Router } from "express";

const router = Router();

router.get("/all", verifier, getReceivings);
router.post("/add", verifier, addReceiving);
router.patch("/update/:id", verifier, updateReceiving);
router.delete("/delete/:id", verifier, deleteReceiving);

export default router;
