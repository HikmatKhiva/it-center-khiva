import { ISchedules } from "@/types";
import { Table, Indicator, Text } from "@mantine/core";
const RoomGroup = ({ schedules }: { schedules: ISchedules[] }) => {
  const rows = schedules.map((schedule, index: number) => (
    <Table.Tr key={index}>
      <Table.Td>{schedule.name}</Table.Td>
      <Table.Td>{schedule.teacher}</Table.Td>
      <Table.Td>{schedule.countStudents}</Table.Td>
      <Table.Td>
        <Indicator
          inline
          label={schedule.weekType === "ODD" ? "Toq" : "Juft"}
          size={15}
        >
          <Text>{schedule.time.replace("T", "").replace("_", ":")}</Text>
        </Indicator>
      </Table.Td>
    </Table.Tr>
  ));
  return (
    <>
      <Table highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Guruh nomi</Table.Th>
            <Table.Th>O'qituvchisi</Table.Th>
            <Table.Th>O'quvchilar soni</Table.Th>
            <Table.Th>Vaqti</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </>
  );
};
export default RoomGroup;