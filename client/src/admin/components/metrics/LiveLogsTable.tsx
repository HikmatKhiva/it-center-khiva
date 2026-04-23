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
  time?: string;
}

interface ParsedLog {
  ip: string;
  time: string;
  parsedTime: Date;
  method: string;
  path: string;
  status: number;
  contentLength: string;
  referrer: string;
  userAgent: string;
  raw: string;
  type: string;
  decodedPath?: string;
}

const parseMorganTime = (timeStr: string): Date => {
  const normalized = timeStr.replace(/^(\d{2}\/\w{3}\/\d{4}):/, "$1 ").trim();
  const date = new Date(normalized);
  return isNaN(date.getTime()) ? new Date() : date;
};

const LiveLogsTable = () => {
  const [logs, setLogs] = useState<ParsedLog[]>([]);
  const [liveMode, { toggle }] = useDisclosure(true);
  const PAGE_SIZE = 15;
  const socket = useSocket();

  const parseLog = useCallback((rawLog: RawLog): ParsedLog => {
    const regex =
      /^([\w.:]+)\s+-\s+-\s+\[([^\]]+)\]\s+"(\w+)\s+([^"]*?)\s+HTTP\/[0-9.]+"\s+(\d{3})\s+(\d+|-\s*)"([^"]*)"\s+"([^"]*)"$/;
    const match = rawLog.message.match(regex);

    if (match && match.length === 9) {
      const ip = (match[1]! as unknown as string)
        .replace(/::ffff:/g, "")
        .trim();
      const time = match[2]! as unknown as string;
      const method = (match[3]! as unknown as string).trim();
      const path = (match[4]! as unknown as string).trim() || "/";
      const statusStr = (match[5]! as unknown as string).trim();
      const status = parseInt(statusStr, 10) || 0;
      const contentLength = (match[6]! as unknown as string).trim();
      const referrer = match[7]! as unknown as string;
      const userAgent = match[8]! as unknown as string;

      const parsedTime = parseMorganTime(time);
      let decodedPath = path;
      try {
        decodedPath = decodeURIComponent(
          path.replace(/&amp;/g, "&").replace(/&quot;/g, '"'),
        );
      } catch {
        // Silent fail
      }

      return {
        ip,
        time,
        parsedTime,
        method,
        path,
        decodedPath,
        status,
        contentLength,
        referrer,
        userAgent,
        raw: rawLog.message,
        type: rawLog.type,
      };
    }

    // Fallback
    const statusMatch = rawLog.message.match(/(\d{3})\s+(\d+|-\s*)/);
    const reqMatch = rawLog.message.match(/"(\w+)\s+([^"]+)"/);
    const ipMatch = rawLog.message.match(/^([\w.:]+)/);
    const timeMatch = rawLog.message.match(/\[([^\]]+)\]/);

    return {
      ip: ipMatch?.[1]
        ? (ipMatch[1] as unknown as string).replace(/::ffff:/g, "").trim()
        : "unknown",
      time: timeMatch?.[1] || new Date().toISOString(),
      parsedTime: new Date(),
      method: reqMatch?.[1]?.trim() || "UNKNOWN",
      path: reqMatch?.[2]?.trim() || "/",
      status: statusMatch
        ? parseInt(statusMatch[1] as unknown as string, 10)
        : 0,
      contentLength: statusMatch?.[2] || "-",
      referrer: "-",
      userAgent: "-",
      raw: rawLog.message,
      type: rawLog.type,
    };
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handleLog = (rawLog: RawLog) => {
      if (rawLog.type === "http" && liveMode) {
        const parsed = parseLog(rawLog);
        setLogs((prev) => {
          const newLogs = [parsed, ...prev.slice(0, 999)];
          return newLogs.sort(
            (a, b) => b.parsedTime.getTime() - a.parsedTime.getTime(),
          );
        });
      }
    };
    const handleHistory = (history: RawLog[]) => {
      const parsed = history
        .filter((log) => log.type === "http")
        .map(parseLog)
        .sort((a, b) => b.parsedTime.getTime() - a.parsedTime.getTime());
      setLogs(parsed.slice(0, 100));
    };

    socket.on("log", handleLog);
    socket.on("logs:history", handleHistory);

    return () => {
      socket.off("log", handleLog);
      socket.off("logs:history", handleHistory);
    };
  }, [socket, liveMode, parseLog]);

  const paginatedLogs = logs.slice(0, PAGE_SIZE);

  const getStatusColor = (status: number) =>
    status >= 400 ? "red" : status >= 300 ? "orange" : "green";

  const rows = paginatedLogs.map((log, i) => (
    <Table.Tr
      key={i}
      className="transition-all hover:from-blue-500/5 hover:to-purple-500/5"
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
        {log.referrer !== "-" ? (
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
          {dayjs(log.parsedTime).format("HH:mm:ss")}
        </Text>
        <Text size="xs" c="dimmed">
          {dayjs(log.parsedTime).format("DD/MM")}
        </Text>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <div>
      <Flex justify="space-between" align="center" mb="lg">
        <Text size="2xl" fw={800}>
          ⚡ LIVE Access Logs
        </Text>
        <ActionIcon
          variant="gradient"
          gradient={{ from: "emerald", to: "teal" }}
          onClick={toggle}
          size="lg"
          title={liveMode ? "Pause live" : "Resume live"}
        />
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
