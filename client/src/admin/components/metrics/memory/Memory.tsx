import { useAdminMetrics } from "@/hooks/useMetrics";
import {
  Box,
  Card,
  Group,
  Progress,
  Skeleton,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
const Memory = () => {
  const { metrics } = useAdminMetrics();
  if (!metrics) {
    return (
      <>
        <Skeleton w="49%" h={260} />
      </>
    );
  }
  const { memory, storage, serverIPs, osInfo } = metrics;
  return (
    <Card w="50%" flex={1} h={230} withBorder>
      <Stack justify="space-between" h={'100%'}>
        <Group justify="space-between">
          <Text size="xl" mb={5}>
            OS: {osInfo?.platform}
          </Text>
          <Text size="xl" mb={5}>
            Server IP: {serverIPs?.length && serverIPs[0]}
          </Text>
        </Group>
        <Box>
          <Group align="center" justify="space-between" mb={10}>
            <Text w={100} size="lg" c="dimmed">
              RAM ({memory.usagePercent}%)
            </Text>
            <Text w={100} truncate="end">
              {memory.usedGB} / {memory.totalGB} GB
            </Text>
          </Group>
          <Progress.Root flex={1} size={20}>
            <Tooltip label={`Band joy: ${memory.usedGB} GB`}>
              <Progress.Section value={memory.usagePercent} color="red">
                <Progress.Label>Band joy</Progress.Label>
              </Progress.Section>
            </Tooltip>
            <Tooltip label={`Bo'sh joy: ${memory.freeGB} GB`}>
              <Progress.Section value={100 - memory.usagePercent} color="blue">
                <Progress.Label>Bo'sh joy</Progress.Label>
              </Progress.Section>
            </Tooltip>
          </Progress.Root>
          <Group align="center" justify="space-between">
            <Text w={100} size="lg" c="dimmed">
              Storage ({storage.usagePercent}%)
            </Text>
            <Text w={100} truncate="end">
              {storage.usedGB} / {storage.totalGB} GB
            </Text>
          </Group>
          <Progress.Root flex={1} size={20}>
            <Tooltip label={`Band joy: ${storage.usedGB} GB`}>
              <Progress.Section value={storage.usagePercent} color="red">
                <Progress.Label>Band joy</Progress.Label>
              </Progress.Section>
            </Tooltip>
            <Tooltip label={`Bo'sh joy: ${storage.freeGB} GB`}>
              <Progress.Section value={100 - storage.usagePercent} color="blue">
                <Progress.Label>Bo'sh joy</Progress.Label>
              </Progress.Section>
            </Tooltip>
          </Progress.Root>
        </Box>
      </Stack>
    </Card>
  );
};
export default Memory;