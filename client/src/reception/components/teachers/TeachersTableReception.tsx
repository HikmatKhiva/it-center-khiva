import ImageModal from "@/admin/components/ImageModal";
import { Table } from "@mantine/core";
const TeachersTableReception = ({ teachers }: { teachers: ITeacher[] }) => {
  const rows =
    Array.isArray(teachers) &&
    teachers?.map((teacher: ITeacher) => (
      <Table.Tr key={teacher.id}>
        <Table.Td>{teacher.id}</Table.Td>
        <Table.Td>
          <ImageModal
            photo={teacher?.photo_url}
            firstName={teacher?.firstName}
          />
        </Table.Td>
        <Table.Td>{teacher.firstName}</Table.Td>
        <Table.Td>{teacher.secondName}</Table.Td>
        <Table.Td>
          {teacher?.phone ? (
            <a href={`tel:${teacher?.phone}`}>{teacher?.phone}</a>
          ) : (
            "Raqam berilmagan."
          )}
        </Table.Td>
      </Table.Tr>
    ));
  return (
    <>
      <Table withTableBorder highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th> id</Table.Th>
            <Table.Th>Photo</Table.Th>
            <Table.Th>Ism</Table.Th>
            <Table.Th>Familiyasi</Table.Th>
            <Table.Th>Telefon raqami</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </>
  );
};
export default TeachersTableReception;