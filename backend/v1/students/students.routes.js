import { Router } from "express";
import {
  createStudent,
  getAllStudents,
  getGroupStudents,
  deleteStudent,
  updateStudent,
  getAStudent,
} from "./students.controller.js";
import { studentSchema, studentUpdateSchema } from "./student.validator.js";
import { validate } from "../../middleware/validation.middleware.js";
export const studentsRoutes = Router();
studentsRoutes.get("/", getGroupStudents);
studentsRoutes.get("/all", getAllStudents);
studentsRoutes.get("/:id", getAStudent);
studentsRoutes.post("/create", validate(studentSchema), createStudent);
studentsRoutes.delete("/delete/:id", deleteStudent);
studentsRoutes.put("/update/:id", validate(studentUpdateSchema), updateStudent);