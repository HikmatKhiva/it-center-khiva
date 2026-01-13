import { IStudents } from "@/types";
import { formatTime } from "@/utils/helper";
import { Indicator, Table, Tooltip } from "@mantine/core";
import PaymentsHistory from "../payment/PaymentsHistory";
const StudentsTable = ({ students }: { students: IStudents[] }) => {
  const rows =
    Array.isArray(students) &&
    students?.map((student: IStudents, index: number) => (
      <Table.Tr key={student.id}>
        <Table.Td>{index + 1}</Table.Td>
        <Table.Td>{`${student.firstName} ${student.secondName}`}</Table.Td>
        <Table.Td>{student.code}</Table.Td>
        <Table.Td>
          <Tooltip
            label={
              !student.Group.isGroupFinished
                ? "Guruh yakunlanmagan!"
                : "Guruh yakunlangan!"
            }
            color={!student.Group.isGroupFinished ? "green" : "red"}
          >
            <Indicator
              inline
              size={8}
              offset={0}
              zIndex={0}
              processing={true}
              position="top-end"
              color={!student.Group.isGroupFinished ? "green" : "red"}
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
        <Table.Td>{formatTime.DateTime(student?.createdAt)}</Table.Td>
        <Table.Td>
          {student?.finishedDate
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
            <Table.Th>O'quvchi</Table.Th>
            <Table.Th>Code</Table.Th>
            <Table.Th>Guruh nomi</Table.Th>
            <Table.Th>PassportId</Table.Th>
            <Table.Th>O'qituvchi</Table.Th>
            <Table.Th>Kurs</Table.Th>
            <Table.Th>To'lov tarixi</Table.Th>
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
