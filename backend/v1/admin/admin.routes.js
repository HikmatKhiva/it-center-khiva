import { Router } from "express";
import { getStats } from "../groups/groups.controller.js";
import { getMessages, deleteMessage } from "../messages/messages.controller.js";
import {
  userProfile,
  updateProfile,
  uploadImage,
  deleteImage,
  registerUser,
  getReceptionAccounts,
  deleteReceptionAccount,
  updateReceptionStatus,
} from "./admin.controller.js";
import { upload } from "../../lib/multer.js";
import { checkRole } from "../../middleware/checkRole.js";
import { downloadGroupCertificateZip } from "../certificates/certificates.controller.js";
export const adminRoutes = Router();
adminRoutes.post("/reception/register", checkRole, registerUser);
adminRoutes.get("/stats", getStats);
adminRoutes.get("/reception", getReceptionAccounts);
adminRoutes.delete("/reception/delete/:id", checkRole, deleteReceptionAccount);
adminRoutes.get("/messages", checkRole, getMessages);
adminRoutes.delete("/messages/:id", checkRole, deleteMessage);
adminRoutes.get("/download/certificate/:id", checkRole, downloadGroupCertificateZip);
adminRoutes.post("/upload-image", upload.single("image"), uploadImage);
adminRoutes.put("/update", updateProfile);
adminRoutes.get("/profile/:id", userProfile);
adminRoutes.delete("/photo-delete", deleteImage);
adminRoutes.put("/reception/status",checkRole, updateReceptionStatus);