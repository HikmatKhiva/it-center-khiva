import { Button, Table } from "@mantine/core";
import { CalendarDays, Pen, Trash } from "lucide-react";
import { Link } from "react-router-dom";
import RoomUpdateModal from "./RoomUpdateModal";
import RoomDeleteModal from "./RoomDeleteModal";
const RoomsTable = () => {
  const test = [
    {
      id: 1,
      name: "1.1",
      capacity: 5,
    },
    {
      id: 2,
      name: "1.1",
      capacity: 5,
    },
    {
      id: 3,
      name: "1.1",
      capacity: 5,
    },
  ];
  const rows = test.map((t) => (
    <Table.Tr key={t.id}>
      <Table.Td>{t.name}</Table.Td>
      <Table.Td>{t.capacity}</Table.Td>
      <Table.Td>
        <Button
          size="xs"
          component={Link}
          to={t.id?.toString()}
          color="grape"
          rightSection={<CalendarDays size={16} />}
        >
          Jadval
        </Button>
      </Table.Td>
      <Table.Td>
        <RoomUpdateModal />
      </Table.Td>
      <Table.Td>
        <RoomDeleteModal />
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
