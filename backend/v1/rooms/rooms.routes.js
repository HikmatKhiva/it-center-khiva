import { Router } from "express";
import {
  createRoom,
  deleteRoom,
  getRoom,
  getRooms,
  updateRoom,
  getRoomTime
} from "./rooms.controller.js";
// import { checkRole } from "../../middleware/checkRole.js";
// import { validate } from "../../middleware/validation.middleware.js";
// import { groupCreateSchema, groupUpdateSchema } from "./group.validator.js";
export const roomRoutes = Router();
roomRoutes.get("/", getRooms);
roomRoutes.get("/:id", getRoom);
roomRoutes.get("/time/:id", getRoomTime);
roomRoutes.post(
  "/create",
  //   validate(groupCreateSchema),
  //   checkRole,
  createRoom
);
roomRoutes.put(
  "/update/:id",
  //   validate(groupUpdateSchema),
  //   checkRole,
  updateRoom
);
roomRoutes.delete(
  "/delete/:id",
  //  checkRole,
  deleteRoom
);
