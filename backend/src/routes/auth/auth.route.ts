import { login, logout, register } from "@/controllers/auth/auth.controller";
import { asyncHandler } from "@/utils/asyncHandler/asyncHandler";
import { Router } from "express";

const router = Router();

router.post("/admin/register", asyncHandler(register));
router.post("/admin/login", asyncHandler(login));
router.post("/logout", asyncHandler(logout));

export default router;
