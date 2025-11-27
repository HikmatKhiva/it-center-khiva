import { Button, Divider, Grid, Group, Stack, Text } from "@mantine/core";
import { weeks } from "@/config";
import { DoorClosed, Timer, TimerOff, UsersRound } from "lucide-react";
import { useState } from "react";
import RoomGroup from "@/admin/components/rooms/RoomGroup";
import BackButton from "@/common/components/BackButton";
const AdminRoomId = () => {
  const [isSelected, setSelected] = useState<string>("");
  const handleSelected = (value: string) => setSelected(value);
  return (
    <>
      <Group justify="space-between">
        <BackButton />
        <Group>
          <Group>
            <Text>Xona nomi:1.1</Text>
            <DoorClosed />
          </Group>
          <Group>
            <Text>Xona Sig'imi:15</Text>
            <UsersRound />
          </Group>
        </Group>
      </Group>
      <Divider mt={16} />
      <Group align="flex-start" className="h-[calc(100vh-140px)]">
        <Stack className="w-80" mt={15}>
          <Grid justify="center">
            <Grid.Col span={3}>
              <Button
                type="button"
                onClick={() => handleSelected("odd")}
                color="green"
                variant={`${isSelected === "odd" ? "filled" : "outline"}`}
              >
                Toq
              </Button>
            </Grid.Col>
            <Grid.Col span={3}>
              <Button
                type="button"
                variant={`${isSelected === "even" ? "filled" : "outline"}`}
                onClick={() => handleSelected("even")}
                color="green"
              >
                Juft
              </Button>
            </Grid.Col>
          </Grid>
          <Divider />
          <Grid className="text-center">
            <Grid.Col span={6}>
              <Button
                leftSection={<Timer size={16} />}
                rightSection={<TimerOff size={16} />}
                type="button"
                color="grape"
                variant="outline"
              >
                9:00 | 11:00
              </Button>
            </Grid.Col>
            <Grid.Col span={6}>
              <Button
                leftSection={<Timer size={16} />}
                rightSection={<TimerOff size={16} />}
                type="button"
                color="grape"
                variant="outline"
              >
                9:00 | 11:00
              </Button>
            </Grid.Col>
          </Grid>
        </Stack>
        <Divider orientation="vertical" />
        <Group mt={15} className="grow">
          <RoomGroup />
        </Group>
      </Group>
    </>
  );
};

export default AdminRoomId;
