import { Router } from "express";
import { checkRole } from "../../middleware/checkRole.js";
import {
  getStats,
  getTeachersSalary,
  getYearlyIncome,
} from "./stats.controller.js";
export const statsRoutes = Router();
statsRoutes.get("/", getStats);
statsRoutes.get("/teachers", checkRole, getTeachersSalary);
statsRoutes.get("/yearly", checkRole, getYearlyIncome);