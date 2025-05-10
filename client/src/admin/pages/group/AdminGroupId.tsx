import {
  Pagination,
  Stack,
  Table,
  ActionIcon,
  Group,
  LoadingOverlay,
} from "@mantine/core";
import { useParams } from "react-router-dom";
import { getGroup } from "@/admin/api/api.group";
import { useQuery } from "@tanstack/react-query";
import DeleteStudentModal from "@/admin/components/student/DeleteStudentModal";
import UpdateStudentModal from "@/admin/components/student/UpdateStudentModal";
import PaymentsHistory from "@/common/components/payment/PaymentsHistory";
import UploadPayment from "@/common/components/payment/UploadPayment";
import { useAppSelector } from "@/hooks/redux";
import { ChangeEvent, useCallback, useState } from "react";
import { selectUser } from "@/lib/redux/reducer/admin";
import NavigateCertificate from "@/admin/components/group/NavigateCertificate";
import { getAllStudent } from "@/admin/api/api.student";
import GroupIdHeader from "@/admin/components/group/GroupIdHeader";
import { Check, Eye, RefreshCw } from "lucide-react";
const AdminGroupId = () => {
  const url = `http://${window?.location?.hostname}/site/certificate?code`;
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
    []
  );
  const { id } = useParams();
  const { data: group } = useQuery({
    queryKey: ["group", id],
    queryFn: () => {
      if (id) {
        return getGroup(parseInt(id), admin?.token || "");
      }
    },
    enabled: !!id && !!admin?.token,
  });
  const { data, isPending, refetch } = useQuery({
    queryKey: ["students", query.name, query.page],
    queryFn: () => getAllStudent(query, admin?.token || "", group?.id),
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
      {!group?.isGroupFinished && (
        <Table.Td>{id && <UpdateStudentModal student={student} />}</Table.Td>
      )}
      {!group?.isGroupFinished && (
        <Table.Td>
          <DeleteStudentModal id={student?.id} />
        </Table.Td>
      )}
      {group?.isGroupFinished && student?.certificate_url && (
        <Table.Td>
          <NavigateCertificate url={student?.certificate_url} />
        </Table.Td>
      )}
      <Table.Td
        hidden={
          !student?.Certificate?.certificateUrl || !group?.isGroupFinished
        }
      >
        <ActionIcon
          disabled={!student?.Certificate?.certificateUrl}
          component={`${
            !student?.Certificate?.certificateUrl ? "button" : "a"
          }`}
          target={`${!student?.Certificate?.certificateUrl ? "" : "_blank"}`}
          href={`${url}=${student?.Certificate?.certificateUrl}`}
          size="lg"
        >
          <Eye />
        </ActionIcon>
      </Table.Td>
      <Table.Td>
        <PaymentsHistory id={student.id} />
      </Table.Td>

      <Table.Td>
        {parseInt(student.debt) === 0 ? (
          <ActionIcon color="teal" variant="light" radius="xl" size="lg">
            <Check size={22} />
          </ActionIcon>
        ) : (
          <UploadPayment studentId={student.id} />
        )}
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
              {group?.isGroupFinished && <Table.Th>Certificate URL</Table.Th>}
              {!group?.isGroupFinished && <Table.Th>O'zgartirish</Table.Th>}
              {!group?.isGroupFinished && <Table.Th>O'chirish</Table.Th>}
              <Table.Th>To'lov tarixi</Table.Th>
              <Table.Th>To'lov qo'shish</Table.Th>
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
