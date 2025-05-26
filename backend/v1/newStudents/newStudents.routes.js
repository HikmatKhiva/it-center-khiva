import { Router } from "express";
import {
  deleteNewStudent,
  getNewStudents,
  updateNewStudent,
} from "./newStudents.controller.js";
import { validate } from "../../middleware/validation.middleware.js";
import { newStudentStatusSchema } from "./newStudent.validation.js";
export const newStudentRoutes = Router();
newStudentRoutes.get("/", getNewStudents);
newStudentRoutes.put(
  "/update/:id",
  validate(newStudentStatusSchema),
  updateNewStudent
);
newStudentRoutes.delete("/delete/:id", deleteNewStudent);