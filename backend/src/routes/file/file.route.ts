import { deleteFileC } from "@/controllers/file/file.controler";
import verifier from "@/middlewares/verifier";
import { Router } from "express";

const router = Router();

router.delete("/delete-file/:publicId", verifier, deleteFileC);

export default router;
