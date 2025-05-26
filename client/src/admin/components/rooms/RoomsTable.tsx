import { Table } from "@mantine/core";
const RoomsTable = () => {
  return (
    <>
      <Table withTableBorder highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>id</Table.Th>
            <Table.Th>Xona raqami</Table.Th>
            <Table.Th>O'zgartirish</Table.Th>
            <Table.Th>O'chirish</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody></Table.Tbody>
      </Table>
    </>
  );
};

export default RoomsTable;
