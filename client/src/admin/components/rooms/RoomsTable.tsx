import { Button, Table } from "@mantine/core";
import { CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import RoomUpdateModal from "./RoomUpdateModal";
import RoomDeleteModal from "./RoomDeleteModal";
const RoomsTable = ({ rooms }: { rooms: IRoom[] }) => {
  const rows = rooms.map((room) => (
    <Table.Tr key={room.id}>
      <Table.Td>{room.name}</Table.Td>
      <Table.Td>{room.capacity}</Table.Td>
      <Table.Td>
        <Button
          size="xs"
          component={Link}
          to={room.id?.toString()}
          color="grape"
          rightSection={<CalendarDays size={16} />}
        >
          Jadval
        </Button>
      </Table.Td>
      <Table.Td>
        <RoomUpdateModal id={room.id} />
      </Table.Td>
      <Table.Td>
        <RoomDeleteModal id={room.id} name={room.name} />
      </Table.Td>
    </Table.Tr>
  ));
  return (
    <>
      <Table withTableBorder highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Xona nomi</Table.Th>
            <Table.Th>Xona Sig'imi</Table.Th>
            <Table.Th>Jadval</Table.Th>
            <Table.Th>O'zgartirish</Table.Th>
            <Table.Th>O'chirish</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </>
  );
};
export default RoomsTable;