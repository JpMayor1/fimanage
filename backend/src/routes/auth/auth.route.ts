import { login, logout, register, forgotPassword, resetPassword } from "@/controllers/auth/auth.controller";
import { asyncHandler } from "@/utils/asyncHandler/asyncHandler";
import { Router } from "express";

const router = Router();

router.post("/admin/register", asyncHandler(register));
router.post("/admin/login", asyncHandler(login));
router.post("/logout", asyncHandler(logout));
router.post("/forgot-password", asyncHandler(forgotPassword));
router.post("/reset-password", asyncHandler(resetPassword));

export default router;
