import { completeOnboardingPage } from "@/controllers/onboarding/onboarding.controller";
import verifier from "@/middlewares/verifier.middleware";
import { Router } from "express";

const router = Router();

router.post("/complete", verifier, completeOnboardingPage);

export default router;

