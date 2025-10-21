import { CustomRequest } from "@/types/express/express.type";
import { deleteFile } from "@/utils/deleteFile/deleteFile";
import { Response } from "express";

export const deleteFileC = async (req: CustomRequest, res: Response) => {
  const { publicId } = req.params;
  await deleteFile(publicId);
  res.status(200).json({ success: true });
};
