import { Router } from "express";
import {
  createCourse,
  getAllCourse,
  deleteCourse,
  updateCourse,
  getACourse,
} from "./courses.controller.js";
import { validate } from "../../middleware/validation.middleware.js";
import { courseSchema } from "./course.validation.js";
export const courseRoutes = Router();
courseRoutes.get("/", getAllCourse);
courseRoutes.get("/:id", getACourse);
courseRoutes.post("/create", validate(courseSchema), createCourse);
courseRoutes.put("/update/:id", updateCourse);
courseRoutes.delete("/delete/:id", deleteCourse);