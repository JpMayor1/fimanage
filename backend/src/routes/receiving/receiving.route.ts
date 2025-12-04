import {
  addReceiving,
  deleteReceiving,
  getReceivings,
  updateReceiving,
} from "@/controllers/receiving/receiving.controller";
import verifier from "@/middlewares/verifier.middleware";
import { asyncHandler } from "@/utils/asyncHandler/asyncHandler";
import { Router } from "express";

const router = Router();

router.get("/all", verifier, asyncHandler(getReceivings));
router.post("/add", verifier, asyncHandler(addReceiving));
router.patch("/update/:id", verifier, asyncHandler(updateReceiving));
router.delete("/delete/:id", verifier, asyncHandler(deleteReceiving));

export default router;
