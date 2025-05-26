import { Router } from "express";
import {
  createTeacher,
  getAllTeacher,
  updateTeacher,
  deleteTeacher,
  handleDeleteImage,
} from "./teachers.controller.js";
import { upload } from "../../lib/multer.js";
import { checkRole } from "../../middleware/checkRole.js";
export const teachersRoutes = Router();
teachersRoutes.get("/", getAllTeacher);
teachersRoutes.post(
  "/create",
  checkRole,
  upload.single("image"),
  createTeacher
);
teachersRoutes.put(
  "/update/:id",
  checkRole,
  upload.single("image"),
  updateTeacher
);
teachersRoutes.patch("/deletePhoto/:id", checkRole, handleDeleteImage);
teachersRoutes.delete("/delete/:id", checkRole, deleteTeacher);