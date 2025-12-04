import { completeOnboardingPage } from "@/controllers/onboarding/onboarding.controller";
import verifier from "@/middlewares/verifier.middleware";
import { asyncHandler } from "@/utils/asyncHandler/asyncHandler";
import { Router } from "express";

const router = Router();

router.post("/complete", verifier, asyncHandler(completeOnboardingPage));

export default router;

