import pino from "pino";
let ioInstance = null;
export const setSocketIO = (io) => {
  ioInstance = io;
};
export const logger = pino({
  level: "info",
  base: null,
  timestamp: pino.stdTimeFunctions.isoTime,
});
// helper to emit logs to UI
export const emitLog = (log) => {
  if (!ioInstance) return;
  ioInstance.to("admin").emit("log", {
    ...log,
    time: new Date().toISOString(),
  });
};