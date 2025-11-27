import {
  addSaving,
  deleteSaving,
  getSavings,
  updateSaving,
} from "@/controllers/saving/saving.controller";
import verifier from "@/middlewares/verifier.middleware";
import { Router } from "express";

const router = Router();

router.get("/all", verifier, getSavings);
router.post("/add", verifier, addSaving);
router.patch("/update/:id", verifier, updateSaving);
router.delete("/delete/:id", verifier, deleteSaving);

export default router;
