import { Router } from "express";
import { getMetrics } from "./metrics.controller.js";
export const metricsRoute = Router();

metricsRoute.get("/", getMetrics);
