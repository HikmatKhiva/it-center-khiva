// import { createServer } from "http";
// import express from "express";
// import cors from "cors";
// import { V1Routes } from "./v1/index.routes.js";
// import morgan from "morgan";
// // test mode
// import pino from "pino";

// import helmet from "helmet";
// import hpp from "hpp";
// import compression from "compression";
// import { PrismaClient } from "@prisma/client";
// import { rateLimiterMiddleware } from "./middleware/rateLimiter.js";
// import { findCertificate } from "./v1/certificates/certificates.controller.js";
// import { findReceipt } from "./v1/receipt/receipt.controller.js";
// import { errorHandler } from "./middleware/globalError.js";
// import { initSocket } from "./socket.io.js";
// import { getSystemInfo } from "./v1/metrics/metrics.helper.js";
// import { checkAdmin } from "./middleware/checkAdmin.js";
// export const prisma = new PrismaClient();
// export const app = express();
// const PORT = process.env?.PORT || 5000;
// const CORS_ORIGIN = process.env?.CORS_ORIGIN || "*";

// const server = createServer(app);
// export const io = initSocket(server);
// // export const logger = pino({
// //   level: "info",
// // });
// // const stream = attachLoggerStream(io);
// // const logger = pino(stream);
// const stream = attachLoggerStream(io);
// // create child logger that writes to stream
// export const socketLogger = pino(stream);

// io.on("connection", (socket) => {
//   console.log("Connected:", socket.id, {
//     isAdmin: !!socket.data.isAdmin,
//     public: !!socket.data.public,
//   });

//   socket.on("disconnect", () => {
//     console.log("Disconnected:", socket.id);
//   });
// });

// setInterval(async () => {
//   try {
//     const metrics = await getSystemInfo(); 
//     io.to("admin").emit("metrics", metrics); 
//   } catch (err) {
//     console.error("Metrics error");
//   }
// }, 5000);

// // middlewares
// app.use(rateLimiterMiddleware); // Use the rate limiter middleware
// app.use(morgan("combined"));
// app.use(
//   cors({
//     origin: [CORS_ORIGIN, "*"],
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   }),
// ); // Enable CORS
// app.use(hpp()); // Prevent HTTP parameter pollution
// app.use(compression()); // Compress responses
// app.use(express.json()); // Parse JSON
// app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
// app.use(helmet()); // Secure HTTP headers
// app.disable("x-powered-by"); // Disable the X-Powered-By header
// // routes
// app.use("/api/v1", V1Routes);
// // find certificate
// app.get("/site/certificate", findCertificate);
// // get receipt
// app.get("/site/receipt/:token", findReceipt);
// app.use(errorHandler);
// // Centralized error handler
// server.listen(PORT, () => {
//   console.log(`server running + Socket http://localhost:${PORT}`);
// });

import { createServer } from "http";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import hpp from "hpp";
import compression from "compression";
import { PrismaClient } from "@prisma/client";

import { V1Routes } from "./v1/index.routes.js";
import { rateLimiterMiddleware } from "./middleware/rateLimiter.js";
import { errorHandler } from "./middleware/globalError.js";
import { findCertificate } from "./v1/certificates/certificates.controller.js";
import { findReceipt } from "./v1/receipt/receipt.controller.js";
import { initSocket } from "./socket.io.js";
import { getSystemInfo } from "./v1/metrics/metrics.helper.js";

import { logger, emitLog, setSocketIO } from "./utils/logger.js";

export const prisma = new PrismaClient();
export const app = express();

const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

const server = createServer(app);
export const io = initSocket(server);

// attach socket to logger
setSocketIO(io);

//
// 🔌 SOCKET CONNECTION
//
io.on("connection", (socket) => {
  const isAdmin = !!socket.data?.isAdmin;

  if (isAdmin) {
    socket.join("admin");
  }

  logger.info({ msg: "Socket connected", id: socket.id, isAdmin });

  emitLog({
    type: "socket",
    message: `Connected: ${socket.id}`,
  });

  socket.on("disconnect", () => {
    logger.info({ msg: "Socket disconnected", id: socket.id });

    emitLog({
      type: "socket",
      message: `Disconnected: ${socket.id}`,
    });
  });
});

//
// 📊 METRICS
//
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

//
// 🧱 MIDDLEWARES
//
app.use(rateLimiterMiddleware);

// 🔥 Morgan → Socket.IO
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
  })
);

app.use(
  cors({
    origin: [CORS_ORIGIN, "*"],
    credentials: true,
  })
);

app.use(hpp());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.disable("x-powered-by");

//
// 🚏 ROUTES
//
app.use("/api/v1", V1Routes);
app.get("/site/certificate", findCertificate);
app.get("/site/receipt/:token", findReceipt);

//
// ❌ ERROR HANDLER
//
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

//
// 🚀 START SERVER
//
server.listen(PORT, () => {
  logger.info({ msg: `Server running on port ${PORT}` });

  emitLog({
    type: "system",
    message: `Server started on port ${PORT}`,
  });
});