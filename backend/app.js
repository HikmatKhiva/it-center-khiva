import { createServer } from "http";
import express from "express";
import cors from "cors";
import { V1Routes } from "./v1/index.routes.js";
import morgan from "morgan";
import helmet from "helmet";
import hpp from "hpp";
import compression from "compression";
import { PrismaClient } from "@prisma/client";
import { rateLimiterMiddleware } from "./middleware/rateLimiter.js";
import { findCertificate } from "./v1/certificates/certificates.controller.js";
import { findReceipt } from "./v1/receipt/receipt.controller.js";
// import { initSocket } from "./socket.io.js";
export const prisma = new PrismaClient();
export const app = express();
const PORT = process.env?.PORT || 5000;
const CORS_ORIGIN = process.env?.CORS_ORIGIN || "*";

const server = createServer(app);

// export const io = initSocket(server);

// middlewares
app.use(rateLimiterMiddleware); // Use the rate limiter middleware
app.use(morgan("combined"));
app.use(
  cors({
    origin: [CORS_ORIGIN, "*"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
); // Enable CORS
app.use(hpp()); // Prevent HTTP parameter pollution
app.use(compression()); // Compress responses
app.use(express.json()); // Parse JSON
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(helmet()); // Secure HTTP headers
app.disable("x-powered-by"); // Disable the X-Powered-By header
// routes
app.use("/api/v1", V1Routes);
// find certificate
app.get("/site/certificate", findCertificate);
// get receipt
app.get("/site/receipt/:token", findReceipt);
// Centralized error handler (example)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message,
  });
});
app.listen(PORT, () => {
  console.log(`server running http://localhost:${PORT}`);
});