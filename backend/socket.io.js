// import { Server } from "socket.io";
// export function initSocket(server) {
//   const CORS_ORIGIN = process.env?.CORS_ORIGIN || "*";
//   const io = new Server(server, {
//     cors: {
//       //   origin: CORS_ORIGIN,
//       origin: true,
//       credentials: true,
//       methods: ["GET","POST"],
//     },
//   });
//   io.on("connection", (socket) => {
//     console.log("Client connected:", socket.id);
//   });

//   return io;
// }
