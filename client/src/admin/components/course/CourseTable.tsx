import { Pagination, Stack, Table } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import UpdatedCourseModal from "./UpdatedCourseModal";
import DeleteCourseModal from "./DeleteCourseModal";
import { useAppSelector } from "@/hooks/redux";
import { selectUser } from "@/lib/redux/reducer/admin";
import { useState } from "react";
import { formatTime } from "@/utils/helper";
import CourseCertificateDemo from "./CourseCertificateDemo";
import { Server } from "@/api/api";
const CourseTable = ({ name }: { name: string }) => {
  const [query, setQuery] = useState({
    page: 1,
    limit: 10,
  });
  const admin = useAppSelector(selectUser);
  const params = new URLSearchParams({
    name,
    page: query.page.toString(),
    limit: query.limit.toString(),
  });
  const { data, isPending } = useQuery<ICoursesResponse>({
    queryKey: ["courses", name, query.page],
    queryFn: () =>
      Server<ICoursesResponse>(`course?${params}`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${admin?.token}`,
        },
      }),
    enabled: !!admin?.token,
  });

  const rows =
    Array.isArray(data?.courses) &&
    data?.courses.map((course: ICourse) => (
      <Table.Tr key={course.id}>
        <Table.Td>{course.name}</Table.Td>
        <Table.Td>{course?.teacher.firstName}</Table.Td>
        <Table.Td>{formatTime.DateTime(new Date(course.createdAt))}</Table.Td>
        <Table.Td>
          <UpdatedCourseModal id={course.id} />
        </Table.Td>
        <Table.Td>
          <DeleteCourseModal id={course?.id} />
        </Table.Td>
        <Table.Td>
          <CourseCertificateDemo teacherFullName={`${course?.teacher?.firstName } ${course?.teacher?.secondName}`} id={course.id} />
        </Table.Td>
      </Table.Tr>
    ));
  return (
    <Stack className="h-[calc(100vh_-_140px)]" justify="space-between">
      <Table withTableBorder highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Course Nomi</Table.Th>
            <Table.Th>O'qitivchisi</Table.Th>
            <Table.Th>Yaratilgan sanasi</Table.Th>
            <Table.Th>O'zgartirish</Table.Th>
            <Table.Th>O'chirish</Table.Th>
            <Table.Th>Demo certificate</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{!isPending && rows}</Table.Tbody>
      </Table>
      <Pagination
        value={query.page}
        hidden={(data?.totalPages ?? 0) <= 1 || isPending}
        onChange={(pageNumber) => setQuery({ ...query, page: pageNumber })}
        total={data?.totalPages || 1}
      />
    </Stack>
  );
};
export default CourseTable;
