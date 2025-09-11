import { login, logout, register } from "@/controllers/auth/auth.controller";
import { Router } from "express";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = Router();

router.post("/admin/register", upload.single("profilePicture"), register);
router.post("/admin/login", login);
router.post("/logout", logout);

export default router;
