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
import { useMutation, useQuery } from "@tanstack/react-query";
import DeleteStudentModal from "@/common/components/student/DeleteStudentModal";
import UpdateStudentModal from "@/common/components/student/UpdateStudentModal";
import PaymentsHistory from "@/common/components/payment/PaymentsHistory";
import UploadPayment from "@/common/components/payment/UploadPayment";
import { useAppSelector } from "@/hooks/redux";
import { ChangeEvent, useCallback, useState } from "react";
import { selectUser } from "@/lib/redux/reducer/admin";
import GroupIdHeader from "@/common/components/group/GroupIdHeader";
import { Check, Eye, FileDown, RefreshCw } from "lucide-react";
import { downloadContract, Server } from "@/api/api";
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
      setQuery((prev: IDefaultQuery) => ({
        ...prev,
        name: event.target.value,
      }));
    },
    [],
  );
  const { id } = useParams();
  const params = new URLSearchParams({
    name: query.name,
    page: query.page.toString(),
    limit: query.limit.toString(),
  });
  const {
    data: group,
    isPending,
    refetch,
  } = useQuery({
    queryKey: ["group", String(id), query.name, query.page],
    queryFn: () => {
      if (id) {
        return Server<IGroupResponse>(`group/${id}?${params}`, {
          method: "GET",
          headers: {
            authorization: `Bearer ${admin?.token}`,
          },
        });
      }
    },
    enabled: !!id && !!admin?.token,
  });
  const { mutateAsync } = useMutation({
    mutationFn: ({ id, fullName }: { id: number; fullName: string }) =>
      downloadContract(id, `${fullName}`, admin?.token || ""),
    mutationKey: ["download", "contract"],
  });
  const handleDownloadContract = async ({
    id,
    fullName,
  }: {
    id: number;
    fullName: string;
  }) => {
    await mutateAsync({ id, fullName });
  };
  const rows = group?.Students?.map((student: IStudent, index: number) => (
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
      <Table.Td>
        {id && <UpdateStudentModal groupId={group?.id} student={student} />}
      </Table.Td>
      <Table.Td>
        <DeleteStudentModal groupId={student.groupId} id={student?.id} />
      </Table.Td>
      <Table.Td hidden={group?.isActive === "PENDING"}>
        <ActionIcon
          disabled={parseInt(student.debt) !== 0}
          component="a"
          target="_blank"
          href={`${url}=${student?.code}`}
          size="lg"
          onClick={(e) => {
            if (parseInt(student.debt) !== 0) e.preventDefault();
          }}
        >
          <Eye size="16" />
        </ActionIcon>
      </Table.Td>
      <Table.Td hidden={group?.isActive === "PENDING"}>
        <PaymentsHistory id={student.id} />
      </Table.Td>
      <Table.Td hidden={group?.isActive === "PENDING"}>
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
        <Button
          disabled={group?.isActive === "PENDING"}
          color="grape"
          variant="outline"
          size="xs"
          onClick={() =>
            handleDownloadContract({
              id: student.id,
              fullName: `${student.firstName} ${student.secondName}`,
            })
          }
        >
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
              <Table.Th>O'chirish</Table.Th>
              <Table.Th hidden={group?.isActive === "PENDING"}>
                Certificate URL
              </Table.Th>
              <Table.Th hidden={group?.isActive === "PENDING"}>
                To'lov tarixi
              </Table.Th>
              <Table.Th hidden={group?.isActive === "PENDING"}>
                To'lov qo'shish
              </Table.Th>
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
            hidden={(group?.totalPages ?? 0) <= 1 || isPending}
            onChange={(pageNumber) => setQuery({ ...query, page: pageNumber })}
            total={group?.totalPages || 1}
          />
        </Group>
      </Stack>
    </section>
  );
};
export default AdminGroupId;
