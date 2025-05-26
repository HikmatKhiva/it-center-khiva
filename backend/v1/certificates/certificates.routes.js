import { Router } from "express";
import {
  downloadCertificate,
  getAllCertificates,
} from "./certificates.controller.js";
export const certificateRoutes = Router();
certificateRoutes.get("/", getAllCertificates);
certificateRoutes.get("/download/:id", downloadCertificate);