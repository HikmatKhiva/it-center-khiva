import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Socket } from "socket.io-client"; // ✅ Import Socket type!
import { io } from "socket.io-client";
import { useAppSelector } from "@/hooks/redux";
import { selectUser } from "@/lib/redux/reducer/admin";
interface SocketContextType {
  socket: Socket | null;
}
const SOCKET_SERVER_URL =
  import.meta.env.VITE_BACKEND_URL || "https://it-khiva.uz";
const SocketContext = createContext<SocketContextType>({ socket: null });
export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const admin = useAppSelector(selectUser);
  useEffect(() => {
    if (!admin?.token) return;
    const newSocket = io(SOCKET_SERVER_URL?.trim(), {
      auth: { token: admin.token },
      path: "/socket.io/",
      transports: ["websocket", "polling"],
    });
    newSocket.on("connect", () => {
      console.log("✅ Socket connected");
    });
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, [admin?.token]);
  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context.socket) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return context.socket;
};
