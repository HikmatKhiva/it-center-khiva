import { Router } from "express";
import { getAllMonthlyDebtors } from "./debtors.controller.js";
export const debtorsRoutes = Router();
debtorsRoutes.get("/", getAllMonthlyDebtors);