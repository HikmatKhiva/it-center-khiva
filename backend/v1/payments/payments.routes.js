import { Router } from "express";
import { getPayments, uploadPayment } from "./payments.controller.js";
import { validate } from "../../middleware/validation.middleware.js";
import { paymentSchema } from "./payment.validation.js";
export const paymentsRoutes = Router();
paymentsRoutes.post("/create", validate(paymentSchema), uploadPayment);
paymentsRoutes.get("/:id", getPayments);
