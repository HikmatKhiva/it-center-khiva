import { Chip, Table } from "@mantine/core";
import OptionsMenuNewStudent from "@/common/components/newstudent/OptionsMenuNewStudent";
import React from "react";
import { Check, Clock3, X } from "lucide-react";
import { formatTime } from "@/utils/helper";
import { INewStudent } from "@/types";
import NewStudentDeleteModal from "./NewStudentDeleteModal";
const NewStudentsTable = ({ newStudents }: { newStudents: INewStudent[] }) => {
  const rows =
    Array.isArray(newStudents) &&
    newStudents?.map((student: INewStudent, index: number) => (
      <Table.Tr key={index}>
        <Table.Td>{index + 1}</Table.Td>
        <Table.Td>
          <CheckStudent isChecked={student.isAttend}>
            {student?.fullName}
          </CheckStudent>
        </Table.Td>
        <Table.Td>
          <a href={`tel:${student?.phone}`}>{student?.phone}</a>
        </Table.Td>
        <Table.Td>{formatTime.DateTimeHours(student?.createdAt)}</Table.Td>
        <Table.Td>{student?.course.name}</Table.Td>
        <Table.Td>{student?.courseTime}</Table.Td>
        <Table.Td>
          <OptionsMenuNewStudent student={student} id={student.id} />
        </Table.Td>
        <Table.Td>
          <NewStudentDeleteModal
            isAttend={student.isAttend}
            fullName={student.fullName}
            id={student.id}
          />
        </Table.Td>
      </Table.Tr>
    ));
  return (
    <>
      <Table withTableBorder highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Soni</Table.Th>
            <Table.Th>To'liq ismi</Table.Th>
            <Table.Th>Telefon raqami</Table.Th>
            <Table.Th>Yozilgan sanasi</Table.Th>
            <Table.Th>Kurs nomi</Table.Th>
            <Table.Th>Vaqt</Table.Th>
            <Table.Th>Sozlash</Table.Th>
            <Table.Th>O'chirish</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </>
  );
};

export default NewStudentsTable;
const CheckStudent = ({
  isChecked,
  children,
}: {
  isChecked: string;
  children: React.ReactNode;
}) => {
  if (isChecked === "PENDING")
    return (
      <Chip
        color="blue"
        variant="filled"
        icon={<Clock3 size={14} />}
        checked={isChecked === "PENDING"}
      >
        {children}
      </Chip>
    );
  if (isChecked === "NOT_CAME")
    return (
      <Chip
        color="red"
        variant="filled"
        icon={<X size={14} />}
        checked={isChecked === "NOT_CAME"}
      >
        {children}
      </Chip>
    );
  return (
    <Chip checked={true} color="green" icon={<Check />}>
      {children}
    </Chip>
  );
};
