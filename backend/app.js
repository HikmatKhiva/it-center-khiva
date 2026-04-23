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
import { errorHandler } from "./middleware/globalError.js";
import { initSocket } from "./socket.io.js";
import { getSystemInfo } from "./v1/metrics/metrics.helper.js";
export const prisma = new PrismaClient();
export const app = express();
const PORT = process.env?.PORT || 5000;
const CORS_ORIGIN = process.env?.CORS_ORIGIN || "*";
import { logger, emitLog, setSocketIO } from "./utils/logger.js";
const server = createServer(app);
export const io = initSocket(server);
// // attach socket to logger
setSocketIO(io);

io.on("connection", (socket) => {
  console.log("Connected:", socket.id, {
    isAdmin: !!socket.data.isAdmin,
    public: !!socket.data.public,
  });

  socket.on("disconnect", () => {
    logger.info({ msg: "Socket disconnected", id: socket.id });
    emitLog({
      type: "socket",
      message: `Disconnected: ${socket.id}`,
    });
  });
});

setInterval(async () => {
  try {
    const metrics = await getSystemInfo();
    io.to("admin").emit("metrics", metrics);
  } catch (err) {
    logger.error({ msg: "Metrics error", err });
    emitLog({
      type: "error",
      message: "Metrics error",
    });
  }
}, 5000);

// middlewares
app.use(rateLimiterMiddleware); // Use the rate limiter middleware
app.use(
  morgan("combined", {
    stream: {
      write: (message) => {
        emitLog({
          type: "http",
          message: message.trim(),
        });
      },
    },
  }),
);
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
app.use((err, req, res, next) => {
  logger.error({
    msg: "Unhandled error",
    path: req.path,
    error: err.message,
  });

  emitLog({
    type: "error",
    message: err.message,
  });

  errorHandler(err, req, res, next);
});
app.set('trust proxy', 1);
// Centralized error handler
server.listen(PORT, () => {
  logger.info({ msg: `Server running on port ${PORT}` });
  emitLog({
    type: "system",
    message: `Server started on port ${PORT}`,
  });
});