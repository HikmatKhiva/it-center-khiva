import { Badge, Button, Group, Indicator, Table, Text } from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import DeleteGroupModal from "./DeleteGroupModal";
import { formatTime } from "@/utils/helper";
import { ArrowDownUp, List } from "lucide-react";
import { useAppSelector } from "@/hooks/redux";
import { selectUser } from "@/lib/redux/reducer/admin";
const GroupTable = ({
  data,
  isPending,
  handleChangeOrder,
}: {
  data: IGroup[];
  isPending: boolean;
  handleChangeOrder: () => void;
}) => {
  const location = useLocation();
  const admin = useAppSelector(selectUser);
  const path = location.pathname.split("/")[1];
  const navigate = useNavigate();
  const rows = data?.map((group: IGroup, index: number) => (
    <Table.Tr key={group.id}>
      <Table.Td>{index + 1}</Table.Td>
      <Table.Td>{group.name}</Table.Td>
      <Table.Td>{group.course.name}</Table.Td>
      <Table.Td>{group.teacher.firstName}</Table.Td>
      <Table.Td>{group.Students.length}</Table.Td>
      <Table.Td>{formatTime.DateTime(group.createdAt)}</Table.Td>
      <Table.Td>
        <div className="relative w-fit h-fit">
          <Indicator
            withBorder
            color={
              group?.isActive === "FINISHED"
                ? "red"
                : group?.isActive === "ACTIVE"
                  ? "green"
                  : "grape"
            }
            processing={group?.isActive !== "FINISHED"}
          >
            <Badge
              color={
                group?.isActive === "FINISHED"
                  ? "red"
                  : group?.isActive === "ACTIVE"
                    ? "green"
                    : "grape"
              }
            >
              {group?.isActive}
            </Badge>
          </Indicator>
        </div>
      </Table.Td>
      <Table.Td>
        <Button
          onClick={() => navigate(`/${path}/group/${group.id}`)}
          variant="outline"
          size="compact-md"
          color="grape"
        >
          <List size="16" />
        </Button>
      </Table.Td>
      <Table.Td>
        <DeleteGroupModal
          disabled={
            group?.isActive === "FINISHED" || admin?.role !== "ADMIN"
          }
          id={group.id}
        />
      </Table.Td>
    </Table.Tr>
  ));
  return (
    <Table withTableBorder highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>N</Table.Th>
          <Table.Th onClick={handleChangeOrder}>
            <Group align="center">
              <Text fw={700} size="sm">
                Guruh nomi
              </Text>
              <ArrowDownUp size={15} />
            </Group>
          </Table.Th>
          <Table.Th>Kurs nomi</Table.Th>
          <Table.Th>O'qituvchisi</Table.Th>
          <Table.Th>Bolalar soni</Table.Th>
          <Table.Th>Boshlangan sana</Table.Th>
          <Table.Th>Guruh holati</Table.Th>
          <Table.Th>Ro'yxati</Table.Th>
          <Table.Th>O'chirish</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{!isPending && rows}</Table.Tbody>
    </Table>
  );
};
export default GroupTable;
