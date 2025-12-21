import { IMemory } from "@/types";
import { Card, Group, Progress, Text } from "@mantine/core";
const Memory = ({ memory }: { memory: IMemory | null }) => {
  return (
    <Card w={'50%'} flex={1} h={200} withBorder>
      <Text>OS: Ubuntu</Text>
      <Text>Server IP: 185.191.141.135</Text>
      <Text>Your IP: </Text>
      <Text>RAM</Text>
      <Group>
        <Progress flex={1} value={50} />
        <Text> 500 / 1GB</Text>
      </Group>
      <Text>Storage</Text>
      <Group>
        <Progress flex={1} value={50} />
        <Text> 500 / 20GB</Text>
      </Group>

    </Card>
  );
};

export default Memory;
