import { csrf } from "@/controllers/csrf/csrf.controller";
import { Router } from "express";

const router = Router();

router.get("/", csrf);

export default router;
