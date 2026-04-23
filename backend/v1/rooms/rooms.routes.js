import { Router } from "express";
import {
  createRoom,
  deleteRoom,
  getRoom,
  getRooms,
  updateRoom,
  getRoomTime,
} from "./rooms.controller.js";
import { validate } from "../../middleware/validation.middleware.js";
import { roomBaseSchema } from "./room.validator.js";
import { checkRole } from "../../middleware/checkRole.js";
export const roomRoutes = Router();
roomRoutes.get("/", getRooms);
roomRoutes.get("/:id", getRoom);
roomRoutes.get("/time/:id", getRoomTime);
roomRoutes.post("/create", checkRole, validate(roomBaseSchema), createRoom);
roomRoutes.put("/update/:id", validate(roomBaseSchema), checkRole, updateRoom);
roomRoutes.delete("/delete/:id", checkRole, deleteRoom);
