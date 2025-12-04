import {
  addDept,
  deleteDept,
  getDepts,
  updateDept,
} from "@/controllers/dept/dept.controller";
import verifier from "@/middlewares/verifier.middleware";
import { asyncHandler } from "@/utils/asyncHandler/asyncHandler";
import { Router } from "express";

const router = Router();

router.get("/all", verifier, asyncHandler(getDepts));
router.post("/add", verifier, asyncHandler(addDept));
router.patch("/update/:id", verifier, asyncHandler(updateDept));
router.delete("/delete/:id", verifier, asyncHandler(deleteDept));

export default router;
