import { Router } from "express";
import {
  createStudent,
  getAllStudents,
  deleteStudent,
  updateStudent,
  getAStudent,
} from "./students.controller.js";
export const studentsRoutes = Router();
studentsRoutes.get("/", getAllStudents);
studentsRoutes.get("/:id", getAStudent);
studentsRoutes.post("/create", createStudent);
studentsRoutes.delete("/delete/:id", deleteStudent);
studentsRoutes.put("/update/:id", updateStudent);
