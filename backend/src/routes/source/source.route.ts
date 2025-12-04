import {
  addSource,
  deleteSource,
  getSources,
  updateSource,
} from "@/controllers/source/source.controller";
import verifier from "@/middlewares/verifier.middleware";
import { asyncHandler } from "@/utils/asyncHandler/asyncHandler";
import { Router } from "express";

const router = Router();

router.get("/all", verifier, asyncHandler(getSources));
router.post("/add", verifier, asyncHandler(addSource));
router.patch("/update/:id", verifier, asyncHandler(updateSource));
router.delete("/delete/:id", verifier, asyncHandler(deleteSource));

export default router;
