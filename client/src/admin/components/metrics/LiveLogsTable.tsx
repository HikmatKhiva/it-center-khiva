import { useEffect, useState, useCallback } from "react";
import {
  Table,
  ScrollArea,
  Badge,
  Text,
  Flex,
  ActionIcon,
  Tooltip,
  Anchor,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import dayjs from "dayjs";
import { useSocket } from "@/context/SocketContext";

interface RawLog {
  type: string;
  message: string;
  time: string;
}
interface ParsedLog {
  ip: string;
  method: string;
  path: string;
  status: number;
  referrer: string;
  userAgent: string;
  raw: string;
  time: string;
}

const LiveLogsTable = () => {
  const [logs, setLogs] = useState<ParsedLog[]>([]);
  const [liveMode, { toggle }] = useDisclosure(true);
  const PAGE_SIZE = 15;
  const socket = useSocket(); // ✅ Fully typed!
  console.log(logs);

  // Parse Morgan log format
  const parseLog = useCallback((rawLog: RawLog): ParsedLog => {
    const regex =
      /([\w.:]+) - - \[([^\]]+)\] "(\w+) ([^"]+) HTTP\/\d\.\d" (\d+) - "([^"]*)" "([^"]*)"/;
    const match = rawLog.message.match(regex);
    return {
      ip: match?.[1] || "unknown",
      method: match?.[3] || "",
      path: match?.[4] || "",
      status: parseInt(match?.[5] || "0"),
      referrer: match?.[6] || "",
      userAgent: match?.[7] || "",
      raw: rawLog.message,
      time: rawLog.time,
    };
  }, []);

  // Socket LIVE updates
  useEffect(() => {
    if (!socket) return;

    const handleLog = (rawLog: RawLog) => {
      if (rawLog.type === "http" && liveMode) {
        const parsed = parseLog(rawLog);
        setLogs((prev) => {
          const newLogs = [parsed, ...prev.slice(0, 999)];
          return newLogs.sort(
            (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime(),
          );
        });
      }
    };

    const handleHistory = (history: RawLog[]) => {
      const parsed = history
        .filter((log) => log.type === "http")
        .map(parseLog)
        .sort(
          (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime(),
        );
      setLogs(parsed.slice(0, 100));
    };

    socket.on("log", handleLog);
    socket.on("logs:history", handleHistory);

    return () => {
      socket.off("log", handleLog);
      socket.off("logs:history", handleHistory);
    };
  }, [socket, liveMode, parseLog]);

  const paginatedLogs = logs.slice(0, PAGE_SIZE); // Show latest 15

  const getStatusColor = (status: number) =>
    status >= 400 ? "red" : status >= 300 ? "orange" : "green";

  const rows = paginatedLogs.map((log, i) => (
    <Table.Tr
      key={i}
      className="transition-all  hover:from-blue-500/5 hover:to-purple-500/5"
    >
      <Table.Td>
        <Badge
          color={log.method === "GET" ? "blue" : "green"}
          size="sm"
          radius="md"
        >
          {log.method}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Anchor href={log.path} size="sm" className="truncate max-w-[250px]">
          {log.path}
        </Anchor>
      </Table.Td>
      <Table.Td ta="center">
        <Badge
          color={getStatusColor(log.status)}
          size="sm"
          variant="filled"
          radius="full"
        >
          {log.status}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Text
          size="sm"
          className="font-mono truncate cursor-copy"
          onClick={() => navigator.clipboard.writeText(log.ip)}
          title="Click to copy IP"
        >
          {log.ip}
        </Text>
      </Table.Td>
      <Table.Td>
        {log.referrer ? (
          <Tooltip label={log.referrer}>
            <Text size="xs" c="dimmed" truncate>
              {log.referrer.replace(/^https?:\/\//, "")}
            </Text>
          </Tooltip>
        ) : (
          <Text size="xs" c="gray.5">
            -
          </Text>
        )}
      </Table.Td>
      <Table.Td>
        <Text size="sm" fw={500}>
          {dayjs(log.time).format("HH:mm:ss")}
        </Text>
        <Text size="xs" c="dimmed">
          {dayjs(log.time).format("DD/MM")}
        </Text>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <div>
      <Flex justify="space-between" align="center" mb="lg">
        <Text
          size="2xl"
          fw={800}
          className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent"
        >
          ⚡ LIVE Access Logs
        </Text>
        <ActionIcon
          variant="gradient"
          gradient={{ from: "emerald", to: "teal" }}
          onClick={toggle}
          size="lg"
          title={liveMode ? "Pause live" : "Resume live"}
        >
          {/* {liveMode ? <IconPlayerPause size={20} /> : <IconPlayerPlay size={20} />} */}
        </ActionIcon>
      </Flex>

      <ScrollArea h={600}>
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Method</Table.Th>
              <Table.Th>Path</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>IP</Table.Th>
              <Table.Th>Referrer</Table.Th>
              <Table.Th>Time</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </ScrollArea>

      <Flex justify="center" mt="md" gap="xs">
        <Text c="dimmed" size="sm">
          Showing latest {paginatedLogs.length} of {logs.length} logs
        </Text>
      </Flex>
    </div>
  );
};

export default LiveLogsTable;
