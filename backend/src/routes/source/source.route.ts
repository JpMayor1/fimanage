import {
  addSource,
  deleteSource,
  getSources,
  updateSource,
} from "@/controllers/source/source.controller";
import verifier from "@/middlewares/verifier.middleware";
import { Router } from "express";

const router = Router();

router.get("/all", verifier, getSources);
router.post("/add", verifier, addSource);
router.patch("/update/:id", verifier, updateSource);
router.delete("/delete/:id", verifier, deleteSource);

export default router;
