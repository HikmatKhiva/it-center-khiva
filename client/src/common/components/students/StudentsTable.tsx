import { formatTime } from "@/utils/helper";
import {
  ActionIcon,
  Group,
  Indicator,
  Table,
  Text,
  Tooltip,
} from "@mantine/core";
import PaymentsHistory from "../payment/PaymentsHistory";
import GuarantorModal from "../student/GuarantorModal";
import UploadPayment from "../payment/UploadPayment";
import { ArrowDownUp, Check } from "lucide-react";
const StudentsTable = ({
  students,
  handleChangeOrder,
}: {
  students: IStudents[];
  handleChangeOrder: () => void;
}) => {
  const rows =
    Array.isArray(students) &&
    students?.map((student: IStudents, index: number) => (
      <Table.Tr key={student.id}>
        <Table.Td>{index + 1}</Table.Td>
        <Table.Td>{`${student.firstName} ${student.secondName}`}</Table.Td>
        <Table.Td>
          <Tooltip
            label={
              student.Group.isActive == "ACTIVE"
                ? "Guruh yakunlanmagan!"
                : student.Group.isActive === "PENDING"
                  ? "Guruh faollashtirilmagan!"
                  : "Guruh yakunlangan!"
            }
            color={
              student.Group?.isActive === "FINISHED"
                ? "red"
                : student.Group?.isActive === "ACTIVE"
                  ? "green"
                  : "grape"
            }
          >
            <Indicator
              inline
              size={8}
              offset={0}
              zIndex={0}
              processing={true}
              position="top-end"
              color={
                student.Group?.isActive === "FINISHED"
                  ? "red"
                  : student.Group?.isActive === "ACTIVE"
                    ? "green"
                    : "grape"
              }
            >
              {student.Group.name}
            </Indicator>
          </Tooltip>
        </Table.Td>
        <Table.Td>
          {student.passportId ? student.passportId : "Passport id berilmagan!"}
        </Table.Td>
        <Table.Td className="truncate">{`${student?.course?.teacher?.firstName} ${student?.course?.teacher?.secondName}`}</Table.Td>
        <Tooltip label={student.course.name}>
          <Table.Td>{student.course.name.slice(0, 10)}...</Table.Td>
        </Tooltip>
        <Table.Td>
          <PaymentsHistory id={student.id} />
        </Table.Td>
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
          <GuarantorModal
            guarantor={student?.guarantor}
            fullName={`${student.firstName} ${student.secondName}`}
          />
        </Table.Td>
        <Table.Td>{formatTime.DateTime(student?.createdAt)}</Table.Td>
        <Table.Td>
          {student.Group?.isActive === "PENDING"
            ? "Faollashtirilmagan!"
            : student?.finishedDate
              ? formatTime.DateTime(student?.finishedDate)
              : "Yakunlamagan!"}
        </Table.Td>
      </Table.Tr>
    ));
  return (
    <>
      <Table withTableBorder highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>N</Table.Th>
            <Table.Th onClick={handleChangeOrder}>
              <Group align="center">
                <Text fw={700} size="sm">
                  O'quvchi
                </Text>
                <ArrowDownUp size={15} />
              </Group>
            </Table.Th>
            <Table.Th>Guruh nomi</Table.Th>
            <Table.Th>PassportId</Table.Th>
            <Table.Th>O'qituvchi</Table.Th>
            <Table.Th>Kurs</Table.Th>
            <Table.Th>To'lov tarixi</Table.Th>
            <Table.Th>To'lov qo'shish</Table.Th>
            <Table.Th>Vasiy</Table.Th>
            <Table.Th>Qo'shilgan vaqti</Table.Th>
            <Table.Th>Yakunlash vaqti </Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </>
  );
};
export default StudentsTable;