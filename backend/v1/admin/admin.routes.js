import { Router } from "express";
import { getMessages, deleteMessage } from "../messages/messages.controller.js";
import {
  userProfile,
  updateProfile,
  uploadImage,
  deleteImage,
} from "./admin.controller.js";
import { upload } from "../../lib/multer.js";
import { checkRole } from "../../middleware/checkRole.js";
import { downloadGroupCertificateZip } from "../certificates/certificates.controller.js";
export const adminRoutes = Router();
adminRoutes.get("/messages", checkRole, getMessages);
adminRoutes.delete("/messages/:id", checkRole, deleteMessage);
adminRoutes.get(
  "/download/certificate/:id",
  checkRole,
  downloadGroupCertificateZip
);
adminRoutes.post("/upload-image", upload.single("image"), uploadImage);
adminRoutes.put("/profile/update", updateProfile);
adminRoutes.get("/profile/:id", userProfile);
adminRoutes.delete("/photo-delete", deleteImage);
