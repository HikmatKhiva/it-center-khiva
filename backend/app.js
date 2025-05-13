import express from "express";
import cors from "cors";
import { V1Routes } from "./v1/index.routes.js";
import morgan from "morgan";
import path from "path";
import helmet from "helmet";
import { PrismaClient } from "@prisma/client";
import { rateLimiterMiddleware } from "./middleware/rateLimiter.js";
import { findCertificate } from "./v1/certificates/certificates.controller.js";
const __dirname = path.resolve();
export const prisma = new PrismaClient();
const app = express();
const PORT = process.env?.PORT || 5000;
const CORS_ORIGIN = process.env?.CORS_ORIGIN || "*";
// middlewares
app.use(rateLimiterMiddleware); // Use the rate limiter middleware
app.use(morgan("combined"));
app.use(
  cors({
    origin: CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
// routes
app.use("/api/v1", V1Routes);
app.get("/site/certificate", findCertificate);
// production preview ui
if (process.env.NODE_ENV === "production") {
  app.use("/", express.static(path.join(__dirname, "client", "dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
  });
}
app.listen(PORT, () => {
  console.log(`server running http://localhost:${PORT}`);
});
export default app;