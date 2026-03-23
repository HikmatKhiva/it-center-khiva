import {
  ActionIcon,
  Group,
  LoadingOverlay,
  Pagination,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/hooks/redux";
import { selectUser } from "@/lib/redux/reducer/admin";
import {
  ArrowDownUp,
  Check,
  LoaderCircle,
  RefreshCw,
  Search,
} from "lucide-react";
import { useCallback, useState } from "react";
import { formatTime } from "@/utils/helper";
import PaymentsHistory from "@/common/components/payment/PaymentsHistory";
import UploadPayment from "@/common/components/payment/UploadPayment";
import { Server } from "@/api/api";
import { IDebtor, IDebtorQuery, IDebtorsResponse } from "@/types";
import { currentYearQuery, years } from "@/config";
const DebtorStudentsReception = () => {
  const user = useAppSelector(selectUser);
  const [query, setQuery] = useState<IDebtorQuery>({
    name: "",
    page: 1,
    limit: 16,
    month: (new Date().getMonth() + 1).toString(),
    year: currentYearQuery || "",
    orderBy: "desc",
  });
  const params = new URLSearchParams({
    name: query.name,
    page: query.page.toString(),
    limit: query.limit.toString(),
    month: query.month,
    year: query.year || "",
    orderBy: query.orderBy,
  });
  const { data, isPending, refetch } = useQuery<IDebtorsResponse>({
    queryFn: () =>
      Server<IDebtorsResponse>(`debtors?${params}`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${user?.token}`,
        },
      }),
    queryKey: [
      "debtors",
      query.name,
      query.page,
      query.month,
      query.year,
      query.orderBy,
    ],
    enabled: !!user?.token,
  });
  const handleChangeOrder = useCallback(() => {
    setQuery((prev) => ({
      ...prev,
      orderBy: prev.orderBy === "asc" ? "desc" : "asc",
    }));
  }, []);
  const rows = data?.debtors?.map((student: IDebtor, index: number) => (
    <Table.Tr key={index}>
      <Table.Td>{student.teacherName}</Table.Td>
      <Table.Td>{student.courseName}</Table.Td>
      <Table.Td>{student.fullName}</Table.Td>
      <Table.Td>{student.groupName}</Table.Td>
      <Table.Td>{student.groupPrice}</Table.Td>
      <Table.Td>{student.passportId}</Table.Td>
      <Table.Td>{student.lastPaymentDate}</Table.Td>
      <Table.Td>{student.totalPaidThisMonth}</Table.Td>
      <Table.Td>{formatTime.DateTime(student.createdAt)}</Table.Td>
      <Table.Td>
        {parseInt(student?.debt) === 0 ? (
          <ActionIcon color="teal" variant="light" radius="xl" size="lg">
            <Check size={22} />
          </ActionIcon>
        ) : (
          <UploadPayment studentId={student.id} />
        )}
      </Table.Td>
      <Table.Td>
        <PaymentsHistory id={student.id} />
      </Table.Td>
    </Table.Tr>
  ));
  return (
    <>
      <Group justify="space-between" align="self-start">
        <Text fz={{ sm: "md", md: "20px" }} mb="10">
          {data?.currentMonth} oy qarzdor o'quvchilar ro'yxati. Soni:{" "}
          {data?.count}
        </Text>
        <Group>
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
          <Select
            defaultValue={query.year}
            placeholder="2025"
            data={years}
            value={query.year}
            onChange={(value) => setQuery({ ...query, year: value || "" })}
            w={90}
          />
        </Group>
      </Group>
      <Stack className="min-h-[calc(100vh_-_280px)] " justify="space-between ">
        <Table withTableBorder highlightOnHover title="Qarzdorlar ro'yxati.">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>O'qituvchi</Table.Th>
              <Table.Th>Kurs</Table.Th>
              <Table.Th onClick={handleChangeOrder}>
                <Group align="center">
                  <Text fw={700} size="sm">
                    Talaba
                  </Text>
                  <ArrowDownUp size={15} />
                </Group>
              </Table.Th>
              <Table.Th>Guruh</Table.Th>
              <Table.Th>Oylik puli</Table.Th>
              <Table.Th>Passport ID</Table.Th>
              <Table.Th>Oxirgi to'lov sanasi</Table.Th>
              <Table.Th>Oxirgi to'lov miqdori</Table.Th>
              <Table.Th>Boshlangan sana.</Table.Th>
              <Table.Th>To'lov</Table.Th>
              <Table.Th>To'lov tarixi</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
        <LoadingOverlay visible={isPending} />
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
export default DebtorStudentsReception;
