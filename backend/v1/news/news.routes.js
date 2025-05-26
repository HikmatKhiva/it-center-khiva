import { Router } from "express";
import { upload } from "../../lib/multer.js";
export const newsRoutes = Router();
import {
  createNews,
  deleteNews,
  getAllNews,
  getNews,
  updateNews,
} from "./news.controller.js";
import { middlewareAdmin } from "../../middleware/admin.middleware.js";
import { checkRole } from "../../middleware/checkRole.js";
// without admin middleware routes
newsRoutes.get("/", getAllNews);
newsRoutes.get("/:slug", getNews);
// with admin middleware routes
newsRoutes.post(
  "/create",
  middlewareAdmin,
  checkRole,
  upload.single("image"),
  createNews
);
newsRoutes.delete("/delete/:id", middlewareAdmin, checkRole, deleteNews);
newsRoutes.put(
  "/update/:slug",
  middlewareAdmin,
  checkRole,
  upload.single("image"),
  updateNews
);