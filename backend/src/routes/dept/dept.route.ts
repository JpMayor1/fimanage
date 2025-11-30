import {
  addDept,
  deleteDept,
  getDepts,
  updateDept,
} from "@/controllers/dept/dept.controller";
import verifier from "@/middlewares/verifier.middleware";
import { Router } from "express";

const router = Router();

router.get("/all", verifier, getDepts);
router.post("/add", verifier, addDept);
router.patch("/update/:id", verifier, updateDept);
router.delete("/delete/:id", verifier, deleteDept);

export default router;
