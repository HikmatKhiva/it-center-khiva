import { Router } from "express";
import { getReceipt } from "./receipt.controller.js";
export const receiptRoutes = Router();
receiptRoutes.get("/:paymentId", getReceipt);