import { useSocket } from "@/context/SocketContext";
import { useEffect, useState } from "react";
export const useAdminMetrics = () => {
  const [metrics, setMetrics] = useState<IMetrics | null>(null);
  const [logs, setLogs] = useState<any | null>(null);
  const socket = useSocket(); 
  useEffect(() => {
    if (!socket) return;
    socket.on("admin:connected", () => {
      console.log("✅ Real-time metrics started");
    });
    socket.on("metrics", (data: IMetrics) => {
      setMetrics(data); 
    });
    socket.on("log", (log:any) => {
      setLogs((prevLogs:any) => {
        const logsArray = Array.isArray(prevLogs) ? prevLogs : [];
        const newLogs = [...logsArray, log];
        return newLogs.slice(-200); 
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