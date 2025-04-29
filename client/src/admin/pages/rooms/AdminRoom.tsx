import { Group, Text } from "@mantine/core";
import RoomsTable from "../../components/rooms/RoomsTable";
import { DoorClosed } from "lucide-react";
const AdminRoom = () => {
  return (
    <section>
      <Group mb="10">
        <Text>Xonalar boshqaruv bo'limi</Text>
        <DoorClosed />
      </Group>
      <RoomsTable />
    </section>
  );
};
export default AdminRoom;
