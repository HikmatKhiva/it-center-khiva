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
  getReceptionAccount
} from "./admin.controller.js";
import { upload } from "../../lib/multer.js";
import { checkRole } from "../../middleware/checkRole.js";
import { downloadGroupCertificateZip } from "../certificates/certificates.controller.js";
export const adminRoutes = Router();
adminRoutes.get("/stats", getStats);
adminRoutes.delete("/reception/delete/:id", checkRole, deleteReceptionAccount);
adminRoutes.get("/messages", checkRole, getMessages);
adminRoutes.delete("/messages/:id", checkRole, deleteMessage);
adminRoutes.get("/download/certificate/:id", checkRole, downloadGroupCertificateZip);
adminRoutes.post("/upload-image", upload.single("image"), uploadImage);
adminRoutes.put("/update", updateProfile);
adminRoutes.get("/profile/:id", userProfile);
adminRoutes.delete("/photo-delete", deleteImage);

adminRoutes.post("/reception/register", checkRole, registerUser);
adminRoutes.get("/reception", getReceptionAccounts);
adminRoutes.get("/reception/:username", getReceptionAccount);
adminRoutes.put("/reception/update/:id", updateProfile);
adminRoutes.put("/reception/status",checkRole, updateReceptionStatus);