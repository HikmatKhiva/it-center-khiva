import { Group, Text } from "@mantine/core";
import RoomsTable from "@/admin/components/rooms/RoomsTable";
import { DoorClosed } from "lucide-react";
import RoomCreateModal from "@/admin/components/rooms/RoomCreateModal";
import Calendar from "@/admin/components/custom/Calendar";
const AdminRoom = () => {
  return (
    <section>
      <Group mb="10" justify="space-between">
        <Group>
          <Text>Xonalar boshqaruv bo'limi</Text>
          <DoorClosed />
        </Group>
        <RoomCreateModal />
      </Group>
      {/* <Calendar /> */}
      <RoomsTable />
    </section>
  );
};
export default AdminRoom;
