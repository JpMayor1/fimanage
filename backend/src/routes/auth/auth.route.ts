import { login, logout, register } from "@/controllers/auth/auth.controller";
import { Router } from "express";

const router = Router();

router.post("/admin/register", register);
router.post("/admin/login", login);
router.post("/logout", logout);

export default router;
