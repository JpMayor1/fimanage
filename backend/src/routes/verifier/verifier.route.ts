import { verify } from "@/controllers/verifier/verifier.controller";
import verifier from "@/middlewares/verifier.middleware";
import { Router } from "express";

const router = Router();

router.get("/", verifier, verify);

export default router;
