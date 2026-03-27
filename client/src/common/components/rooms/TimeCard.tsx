import {
  ActionIcon,
  Card,
  Grid,
  Indicator,
  Text,
  Tooltip,
} from "@mantine/core";
import { TimeGrid } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { Table } from "lucide-react";
import DrawerTable from "./DrawerTable";
const TimeCard = ({ room }: { room: IRoom }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const timesRange = ["09:00:00", "11:00:00", "14:00:00", "16:00:00"];
  return (
    <>
      <Indicator
        offset={2}
        position="top-start"
        color="green"
        label={room.capacity}
        radius="lg"
        size={16}
      >
        <Card withBorder pos={"relative"} w={200} h={230}>
          <Tooltip label="Jadval">
            <ActionIcon
              onClick={open}
              pos={"absolute"}
              top={5}
              right={5}
              size={"md"}
              color="green"
            >
              <Table size={16} />
            </ActionIcon>
          </Tooltip>
          <Text fw={700} size="lg" ta="center">
            {room.name}
          </Text>
          <Grid className="time-schedules_btn">
            <Grid.Col span={6}>
              <Text ta={"center"}>Toq</Text>
              <TimeGrid
                allowDeselect={false}
                simpleGridProps={{
                  type: "container",
                  cols: { base: 1 },
                  spacing: "xs",
                }}
                data={timesRange}
                disableTime={room.schedules.ODD.time || []}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Text ta={"center"}>Juft</Text>
              <TimeGrid
                allowDeselect={false}
                simpleGridProps={{
                  type: "container",
                  cols: { base: 1 },
                  spacing: "xs",
                }}
                data={timesRange}
                disableTime={room.schedules.EVEN.time || []}
              />
            </Grid.Col>
          </Grid>
        </Card>
      </Indicator>
      {opened && <DrawerTable id={room.id} opened={opened} close={close} />}
    </>
  );
};
export default TimeCard;
