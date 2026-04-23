import {
  // Box,
  //  Card,
  Group,
  // Text
} from "@mantine/core";
import Memory from "./memory/Memory";
import CPU from "./cpu/CPU";
import LiveLogsTable from "./LiveLogsTable";
// import Logs from "./logs/Logs";
function Metrics({ isActive }: { isActive: boolean }) {
  return (
    <>
      <Group wrap="wrap" mb={20}>
        <CPU isActive={isActive} />
        <Memory />
      </Group>
      <LiveLogsTable />
    </>
  );
}

export default Metrics;
