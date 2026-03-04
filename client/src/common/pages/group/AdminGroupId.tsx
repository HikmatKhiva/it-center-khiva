import {
  Pagination,
  Stack,
  Table,
  ActionIcon,
  Group,
  LoadingOverlay,
  Button,
} from "@mantine/core";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import DeleteStudentModal from "@/common/components/student/DeleteStudentModal";
import UpdateStudentModal from "@/common/components/student/UpdateStudentModal";
import PaymentsHistory from "@/common/components/payment/PaymentsHistory";
import UploadPayment from "@/common/components/payment/UploadPayment";
import { useAppSelector } from "@/hooks/redux";
import { ChangeEvent, useCallback, useState } from "react";
import { selectUser } from "@/lib/redux/reducer/admin";
import GroupIdHeader from "@/common/components/group/GroupIdHeader";
import { Check, Eye, FileDown, RefreshCw } from "lucide-react";
import { Server } from "@/api/api";
import { IDefaultQuery, IGroup, IStudentsResponse, IStudent } from "@/types";
import GuarantorModal from "@/common/components/student/GuarantorModal";
const AdminGroupId = () => {
  const url = `/site/certificate?code`;
  const admin = useAppSelector(selectUser);
  const [query, setQuery] = useState<IDefaultQuery>({
    name: "",
    limit: 12,
    page: 1,
  });
  const handleChangeInput = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      setQuery((prev) => ({ ...prev, name: event.target.value }));
    },
    [],
  );
  const { id } = useParams();
  const { data: group } = useQuery({
    queryKey: ["group", id],
    queryFn: () => {
      if (id) {
        return Server<IGroup>(`group/${id}`, {
          method: "GET",
          headers: {
            authorization: `Bearer ${admin?.token}`,
          },
        });
      }
    },
    enabled: !!id && !!admin?.token,
  });
  const params = new URLSearchParams({
    name: query.name,
    page: query.page.toString(),
    limit: query.limit.toString(),
    ...(id !== undefined && { groupId: id.toString() }),
  });
  const { data, isPending, refetch } = useQuery<IStudentsResponse>({
    queryKey: ["students", query.name, query.page],
    queryFn: () =>
      Server<IStudentsResponse>(`students?${params}`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${admin?.token}`,
        },
      }),
    enabled: !!admin?.token && !!group?.id,
  });
  const rows = data?.students?.map((student: IStudent, index: number) => (
    <Table.Tr key={student.id}>
      <Table.Td>{index + 1}</Table.Td>
      <Table.Td>{student.firstName}</Table.Td>
      <Table.Td>{student.secondName}</Table.Td>
      <Table.Td>{student.passportId}</Table.Td>
      <Table.Td>
        {student?.phone !== null ? (
          <a href={`tel:${student.phone}`}>{student?.phone}</a>
        ) : (
          "Raqam ko'rsatilmagan"
        )}
      </Table.Td>
      <Table.Td>{student?.gender === "MALE" ? "Erkak" : "Ayol"}</Table.Td>
      <Table.Td>{id && <UpdateStudentModal student={student} />}</Table.Td>
      <Table.Td>
        <DeleteStudentModal id={student?.id} />
      </Table.Td>
      <Table.Td hidden={!group?.isGroupFinished}>
        <ActionIcon
          component="a"
          target="_blank"
          href={`${url}=${student?.code}`}
          size="lg"
        >
          <Eye />
        </ActionIcon>
      </Table.Td>
      <Table.Td hidden={!group?.isActive}>
        <PaymentsHistory id={student.id} />
      </Table.Td>
      <Table.Td hidden={!group?.isActive}>
        {parseInt(student.debt) === 0 ? (
          <ActionIcon color="teal" variant="light" radius="xl" size="lg">
            <Check size={22} />
          </ActionIcon>
        ) : (
          <UploadPayment studentId={student.id} />
        )}
      </Table.Td>
      <Table.Td>
        <GuarantorModal
          guarantor={student?.guarantor}
          fullName={`${student.firstName} ${student.secondName}`}
        />
      </Table.Td>
      <Table.Td>
        <Button color="grape" variant="outline" size="xs">
          <FileDown size="16" />
        </Button>
      </Table.Td>
    </Table.Tr>
  ));
  return (
    <section>
      {group && (
        <GroupIdHeader
          group={group}
          name={query.name}
          handleChangeInput={handleChangeInput}
        />
      )}
      <Stack className="h-[calc(100vh_-_150px)]" justify="space-between ">
        <Table withTableBorder highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>N</Table.Th>
              <Table.Th>Ism</Table.Th>
              <Table.Th>Familiyasi</Table.Th>
              <Table.Th>Passport</Table.Th>
              <Table.Th>Telefon</Table.Th>
              <Table.Th>Jins</Table.Th>
              <Table.Th>O'zgartirish</Table.Th>
              {group?.isGroupFinished && <Table.Th>Certificate URL</Table.Th>}
              <Table.Th>O'chirish</Table.Th>
              <Table.Th hidden={!group?.isActive}>To'lov tarixi</Table.Th>
              <Table.Th hidden={!group?.isActive}>To'lov qo'shish</Table.Th>
              <Table.Th>Vasiy</Table.Th>
              <Table.Th>Shartnoma</Table.Th>
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
    </section>
  );
};
export default AdminGroupId;
