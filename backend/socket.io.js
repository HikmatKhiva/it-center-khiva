import { Server } from "socket.io";
import dotenv from "dotenv";
import { checkAdmin } from "./middleware/checkAdmin.js";
import { logger } from "./utils/logger.js";
dotenv.config();
const CORS_ORIGIN = process.env?.CORS_ORIGIN || "*";
export function initSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: CORS_ORIGIN,
      origin: true,
      credentials: true,
      methods: ["GET", "POST"],
    },
  });

  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.query.token;
    if (!token) {
      socket.data.public = true;
      return next();
    }
    try {
      const isAdmin = await checkAdmin(token);
      if (isAdmin) {
        socket.data.isAdmin = true;
        socket.join("admin"); // Private admin room
        // console.log("✅ Admin verified:", socket.id);
        logger.info({ msg: "✅ Admin verified", id: socket.id, isAdmin });
      } else {
        socket.data.public = true; // Invalid token = public
      }
      next();
    } catch (err) {
      next(new Error("Token error"));
    }
  });
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
  });
  return io;
}
