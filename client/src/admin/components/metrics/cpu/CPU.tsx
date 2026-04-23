import { useAdminMetrics } from "@/hooks/useMetrics";
import { Sparkline } from "@mantine/charts";
import { Box, Card, Group, Skeleton, Stack, Text } from "@mantine/core";
import { useEffect, useState } from "react";
const CPU = ({ isActive }: { isActive: boolean }) => {
  const SOCKET_SERVER_URL =
  import.meta.env.VITE_BACKEND_URL || "https://it-khiva.uz";
  console.log(SOCKET_SERVER_URL);
  const { metrics } = useAdminMetrics();
  const [cpuHistory, setCpuHistory] = useState<number[]>([]);
  useEffect(() => {
    if (!metrics || !metrics.cpu) {
      console.log("⏳ Waiting for metrics:", metrics);
      return;
    }
    const cpuPercent = Math.round(metrics?.cpu?.loadAverage1m * 100);
    setCpuHistory((prev) => {
      const newHistory = [...prev, cpuPercent].slice(-30);
      return newHistory;
    });
  }, [metrics, isActive]);
  if (!metrics) {
    return (
      <>
        <Skeleton w="49%" h={260} />
      </>
    );
  }
  
  return (
    <Card withBorder w="50%" h={230}>
      <Stack>
        <Box>
          <Group justify="space-between" align="center">
            <Text size="lg" fw={500}>
              CPU Load: {metrics.cpu.usagePercent}%
            </Text>
            <Text  size="md" fw={500}>
              CPU Core count : {metrics.cpu.coreCount}
            </Text>
          </Group>
          <Text c="dimmed" size="sm">
            Live - {cpuHistory.length}/30 points
          </Text>
        </Box>

        <Sparkline
          w="100%"
          h={150}
          data={cpuHistory.length ? cpuHistory : [0]}
          curveType="linear"
          color={metrics.cpu.usagePercent > 40 ? "red" : "blue"}
          fillOpacity={0.29}
          strokeWidth={2.6}
        />
      </Stack>
    </Card>
  );
};
export default CPU;
