import { downloadCertificate } from "@/api/api";
import { useAppSelector } from "@/hooks/redux";
import { selectUser } from "@/lib/redux/reducer/admin";
import { ICertificateStudents } from "@/types";
import { formatTime } from "@/utils/helper";
import { ActionIcon, Table } from "@mantine/core";
import { ArrowDownToLine, Eye } from "lucide-react";
const CertificateTable = ({
  students,
}: {
  students: ICertificateStudents[];
}) => {
  const admin = useAppSelector(selectUser);
  const url = `/site/certificate?code`;
  const handleDownload = async (id: number, name: string) => {
    await downloadCertificate(id, name, admin?.token || "");
  };
  const rows =
    Array.isArray(students) &&
    students?.map((student: ICertificateStudents, index: number) => (
      <Table.Tr key={student.id}>
        <Table.Td>{index + 1}</Table.Td>
        <Table.Td>{`${student.firstName} ${student.secondName}`}</Table.Td>
        <Table.Td>{student.code}</Table.Td>
        <Table.Td>
          {student.passportId ? student.passportId : "Passport id berilmagan!"}
        </Table.Td>
        <Table.Td>{`${student?.course?.teacher?.firstName} ${student?.course?.teacher?.secondName}`}</Table.Td>
        <Table.Td>{student.course.name}</Table.Td>
        <Table.Td>{formatTime.DateTime(student?.finishedDate)}</Table.Td>
        <Table.Td>
          <ActionIcon
            component="a"
            target="_blank"
            href={`${url}=${student?.code}`}
            size="lg"
          >
            <Eye size="18" />
          </ActionIcon>
        </Table.Td>
        <Table.Td>
          <ActionIcon
            onClick={() =>
              handleDownload(
                student?.id,
                `${student?.firstName}/${student?.secondName}`
              )
            }
            size="lg"
            color="grape"
          >
            <ArrowDownToLine size="18" />
          </ActionIcon>
        </Table.Td>
      </Table.Tr>
    ));
  return (
    <>
      <Table withTableBorder highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Id</Table.Th>
            <Table.Th>O'quvchi</Table.Th>
            <Table.Th>Code</Table.Th>
            <Table.Th>PassportId</Table.Th>
            <Table.Th>O'qituvchi</Table.Th>
            <Table.Th>Kurs</Table.Th>
            <Table.Th>Vaqt</Table.Th>
            <Table.Th>Sertificat</Table.Th>
            <Table.Th>Yuklash.</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </>
  );
};
export default CertificateTable;