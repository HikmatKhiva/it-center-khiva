import { ActionIcon, Indicator, Table, Text } from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import DeleteGroupModal from "./DeleteGroupModal";
import { formatTime } from "@/utils/helper";
import { Pencil } from "lucide-react";
const GroupTable = ({
  data,
  isPending,
  status,
}: {
  data: IGroup[];
  isPending: boolean;
  status: boolean;
}) => {
  const location = useLocation();
  const path = location.pathname.split('/')[1];
  const navigate = useNavigate();
  const rows = data?.map((group: IGroup) => (
    <Table.Tr key={group.id}>
      <Table.Td>{group.name}</Table.Td>
      <Table.Td>{group.course.name}</Table.Td>
      <Table.Td>{group.teacher.firstName}</Table.Td>
      <Table.Td>{group.Students.length}</Table.Td>
      <Table.Td>{formatTime.DateTime(group.createdAt)}</Table.Td>
      <Table.Td>
        <div className="relative w-fit h-fit">
          <Indicator
            withBorder
            color={group.isGroupFinished ? "red" : "green"}
            processing={!group.isGroupFinished}
          >
            <Text>
              {group.isGroupFinished === false ? "Active" : "Finished"}
            </Text>
          </Indicator>
        </div>
      </Table.Td>
      <Table.Td>
        <ActionIcon
          onClick={() => navigate(`/${path}/group/${group.id}`)}
          variant="outline"
          size="md"
          color="grape"
        >
          <Pencil size="16" />
        </ActionIcon>
      </Table.Td>
      {!group?.isGroupFinished && (
        <Table.Td>
          <DeleteGroupModal disabled={group?.isGroupFinished} id={group.id} />
        </Table.Td>
      )}
    </Table.Tr>
  ));
  return (
    <Table withTableBorder highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Guruh nomi</Table.Th>
          <Table.Th>Kurs nomi</Table.Th>
          <Table.Th>O'qitivchisi</Table.Th>
          <Table.Th>Bolalar soni</Table.Th>
          <Table.Th>Boshlangan sana</Table.Th>
          <Table.Th>Guruh holati</Table.Th>
          <Table.Th>Sozlash</Table.Th>
          {!status && <Table.Th>O'chirish</Table.Th>}
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{!isPending && rows}</Table.Tbody>
    </Table>
  );
};
export default GroupTable;