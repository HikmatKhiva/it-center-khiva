import { Table } from "@mantine/core";

const RoomGroup = () => {
  const test = [
    {
      id: 1,
      name: "Savodxonlik 11",
      teacher: "Xudayshukur Polvanov",
      capacity: 5,
      time: "9:00",
    },
    {
      id: 2,
      name: "Front End 5",
      teacher: "Xudayshukur Polvanov",
      capacity: 5,
      time: "11:00",
    },
    {
      id: 3,
      name: "Mobilagrafiya 11",
      teacher: "Xudayshukur Polvanov",
      capacity: 5,
      time: "14:00",
    },
  ];
  const rows = test.map((t) => (
    <Table.Tr key={t.id}>
      <Table.Td>{t.name}</Table.Td>
      <Table.Td>{t.teacher}</Table.Td>
      <Table.Td>{t.capacity}</Table.Td>
      <Table.Td>{t.time}</Table.Td>
    </Table.Tr>
  ));
  return (
    <>
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Guruh nomi</Table.Th>
            <Table.Th>O'qituvchisi</Table.Th>
            <Table.Th>O'quvchilsan soni</Table.Th>
            <Table.Th>Vaqti</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </>
  );
};

export default RoomGroup;
