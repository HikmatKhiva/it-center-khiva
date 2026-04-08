import { useSocket } from "@/context/SocketContext";
import { useEffect, useState } from "react";
// import { useSocket } from "./useSocket";
export const useAdminMetrics = () => {
  const [metrics, setMetrics] = useState<IMetrics | null>(null);
  const [logs, setLogs] = useState<any | null>(null);
  //   const { socket } = useSocket();
  const socket = useSocket(); // ✅ Fully typed!
  useEffect(() => {
    if (!socket) return;
    socket.on("admin:connected", () => {
      console.log("✅ Real-time metrics started");
    });
    // Live metrics stream
    socket.on("metrics", (data: IMetrics) => {
      setMetrics(data); // Updates UI automatically!
    });
    socket.on("log", (log) => {
      setLogs((prevLogs) => {
        const logsArray = Array.isArray(prevLogs) ? prevLogs : [];
        const newLogs = [...logsArray, log];
        return newLogs.slice(-200); // keep last 200 logs
      });
      console.log("[LOG]", log);
    });

    return () => {
      socket.off("admin:connected");
      socket.off("metrics");
      socket.off("log");
    };
  }, [socket]);

  return { metrics, logs };
};
