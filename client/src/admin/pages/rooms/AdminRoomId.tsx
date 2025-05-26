import { Grid, Group, Table } from "@mantine/core";
import AdminRoomTimeCreateModal from "../../components/rooms/AdminRoomTimeCreateModal";
import { weeks } from "../../../config";

const AdminRoomId = () => {
  return (
    <>
      <Group justify="end" mb="10">
        <AdminRoomTimeCreateModal />
      </Group>
      <Grid className=" h-[calc(100vh_-_150px)]" >
        {weeks.map((week: string, index: number) => (
          <Grid.Col bd="1px solid black" ta="center" key={index} span={2}>
            {week}
          </Grid.Col>
        ))}

      </Grid>
      <Table withTableBorder highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Dushanba</Table.Th>
            <Table.Th>Seshanba</Table.Th>
            <Table.Th>Chorshanba</Table.Th>
            <Table.Th>Payshanba</Table.Th>
            <Table.Th>Juma</Table.Th>
            <Table.Th>Shanba</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody></Table.Tbody>
      </Table>
    </>
  );
};

export default AdminRoomId;
