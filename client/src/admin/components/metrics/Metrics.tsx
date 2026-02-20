import { Box, Card, Group, Text } from "@mantine/core";
import Memory from "./memory/Memory";
import { useAppSelector } from "@/hooks/redux";
import { selectUser } from "@/lib/redux/reducer/admin";
import { useQuery } from "@tanstack/react-query";
import { Server } from "@/api/api";
import { IMetricsResponse } from "@/types";
// import { io } from "socket.io-client";
// import { useEffect } from "react";
import CPU from "./cpu/CPU";
import Logs from "./logs/Logs";
const Metrics = ({ isActive }: { isActive: boolean }) => {
  const admin = useAppSelector(selectUser);
  //   const API_URL = `"http://localhost`;
  //   const socket = io(API_URL, {
  //     withCredentials: true,
  //     transports: ["websocket", "polling"], // avval WebSocket sinab ko'radi

  //     // path:"/socket.io"
  //   });

  //   useEffect(() => {
  //     socket.on("metrics", (data) => {
  //       console.log(data);
  //     });

  //     return () => {
  //       socket.off("server_metrics");
  //     };
  //   }, []);
  const { data } = useQuery({
    queryFn: () =>
      Server<IMetricsResponse>(`metrics`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${admin?.token}`,
        },
      }),
    queryKey: ["metrics"],
    enabled: !!admin?.token && isActive,
  });
  return (
    <>
      <Group wrap="wrap" mb={20}>
        <CPU />
        <Memory memory={data?.memory || null} />
      </Group>
      <Logs />
    </>
  );
};

export default Metrics;
