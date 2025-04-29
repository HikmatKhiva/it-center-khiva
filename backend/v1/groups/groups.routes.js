import { Router } from "express";
import {
  createGroup,
  getAllGroup,
  getGroup,
  deleteGroup,
  updateGroup,
  finishGroup,
} from "./groups.controller.js";
import { checkRole } from "../../middleware/checkRole.js";
import { validate } from "../../middleware/validation.middleware.js";
import { groupCreateSchema, groupUpdateSchema } from "./group.validator.js";
export const groupRoutes = Router();
groupRoutes.get("/", getAllGroup);
groupRoutes.get("/:id", getGroup);
groupRoutes.post(
  "/create",
  validate(groupCreateSchema),
  checkRole,
  createGroup
);
groupRoutes.put(
  "/update/:id",
  validate(groupUpdateSchema),
  checkRole,
  updateGroup
);
groupRoutes.patch("/finish/:id", checkRole, finishGroup);
groupRoutes.delete("/delete/:id", checkRole, deleteGroup);