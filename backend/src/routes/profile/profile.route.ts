import { updateProfile } from "@/controllers/profile/profile.controller";
import verifier from "@/middlewares/verifier.middleware";
import { Router } from "express";

const router = Router();

router.patch("/update", verifier, updateProfile);

export default router;
