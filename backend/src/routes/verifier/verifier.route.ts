import { verify, verifySilent } from "@/controllers/verifier/verifier.controller";
import verifier from "@/middlewares/verifier.middleware";
import verifierSilent from "@/middlewares/verifierSilent.middleware";
import { Router } from "express";

const router = Router();

router.get("/", verifier, verify);
router.get("/silent", verifierSilent, verifySilent);

export default router;
