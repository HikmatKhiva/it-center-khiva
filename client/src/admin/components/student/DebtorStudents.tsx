import {
  ActionIcon,
  Group,
  Pagination,
  Stack,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/hooks/redux";
import { selectUser } from "@/lib/redux/reducer/admin";
import { LoaderCircle, RefreshCw, Search } from "lucide-react";
import { useState } from "react";
import { formatTime } from "@/utils/helper";
import { Server } from "@/api/api";
const DebtorStudents = () => {
  const admin = useAppSelector(selectUser);
  const [query, setQuery] = useState<IDebtorQuery>({
    name: "",
    page: 1,
    limit: 10,
    month: (new Date().getMonth() + 1).toString(),
  });
  const params = new URLSearchParams({
    name: query.name,
    page: query.page.toString(),
    limit: query.limit.toString(),
    month: query.month,
  });
  const { data, isPending, refetch } = useQuery<IDebtorsResponse>({
    queryFn: () =>
      Server<IDebtorsResponse>(`debtors?${params}`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${admin?.token}`,
        },
      }),
    queryKey: ["debtors", query.name, query.page, query.month],
    enabled: !!admin?.token,
  });
  const rows = data?.debtors?.map((student: IDebtor, index: number) => (
    <Table.Tr key={index}>
      <Table.Td>{student.id}</Table.Td>
      <Table.Td>{student.fullName}</Table.Td>
      <Table.Td>{student.teacherName}</Table.Td>
      <Table.Td>{student.courseName}</Table.Td>
      <Table.Td>{student.groupPrice}</Table.Td>
      <Table.Td>{student.passportId}</Table.Td>
      <Table.Td>{student.lastPaymentDate}</Table.Td>
      <Table.Td>{student.totalPaidThisMonth}</Table.Td>
      <Table.Td>{formatTime.DateTime(student.createdAt)}</Table.Td>
    </Table.Tr>
  ));
  return (
    <>
      <Group justify="space-between" align="self-start">
        <Text fz={{ sm: "md", md: "20px" }} mb="10">
          {data?.currentMonth} oy qarzdor o'quvchilar ro'yxati.
        </Text>
        <Group>
          {/* <Select
            size="xs"
            leftSection={<CalendarFold />}
            w={130}
            data={selectMonths}
            value={query.month}
            onChange={(value) => setQuery({ ...query, month: value || "" })}
          /> */}
          <TextInput
            size="xs"
            value={query.name}
            fz="xs"
            rightSection={
              isPending ? (
                <LoaderCircle size={16} className="animate-spin" />
              ) : (
                <Search size={16} />
              )
            }
            onChange={(event) =>
              setQuery((prev) => ({ ...prev, name: event.target.value }))
            }
            placeholder="O'quvchi ismi..."
          />
        </Group>
      </Group>
      <Stack className="h-[calc(100vh_-_360px)]" justify="space-between ">
        <Table withTableBorder highlightOnHover title="Qarzdorlar ro'yxati.">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Table.Th>O'quvchini ismi</Table.Th>
              <Table.Th>O'qituvchini ismi</Table.Th>
              <Table.Th>Kurs nomi</Table.Th>
              <Table.Th>Guruh oylik puli</Table.Th>
              <Table.Th>Passport ID</Table.Th>
              <Table.Th>Oxirgi to'lov sanasi</Table.Th>
              <Table.Th>Oxirgi to'lov miqdori</Table.Th>
              <Table.Th>O'quvchi qo'shilgan sana</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
        <Group justify="space-between">
          <ActionIcon onClick={() => refetch()} size="lg" color="indigo">
            <RefreshCw size="18" />
          </ActionIcon>
          <Pagination
            value={query.page}
            className="self-end"
            color="indigo"
            hidden={(data?.totalPages ?? 0) <= 1 || isPending}
            onChange={(pageNumber) => setQuery({ ...query, page: pageNumber })}
            total={data?.totalPages || 1}
          />
        </Group>
      </Stack>
    </>
  );
};
export default DebtorStudents;
