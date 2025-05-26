import { Router } from "express";
import { checkRole } from "../../middleware/checkRole.js";
import {
  getReceptionAccount,
  deleteReceptionAccount,
  getReceptionAccounts,
  updateReception,
  updateReceptionStatus,
} from "./reception.controller.js";
import { registerUser } from "../admin/admin.controller.js";
export const receptionRoutes = Router();
receptionRoutes.get("", getReceptionAccounts);
receptionRoutes.get("/:id", getReceptionAccount);
receptionRoutes.post("/register", checkRole, registerUser);
receptionRoutes.put("/update/:id", updateReception);
receptionRoutes.patch("/status", checkRole, updateReceptionStatus);
receptionRoutes.delete("/delete/:id", checkRole, deleteReceptionAccount);