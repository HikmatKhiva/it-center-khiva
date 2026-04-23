import { Server } from "@/api/api";
import StudentsTable from "@/common/components/students/StudentsTable";
import { currentYearQuery, years } from "@/config";
import { useAppSelector } from "@/hooks/redux";
import useFormData from "@/hooks/useFormData";
import { selectUser } from "@/lib/redux/reducer/admin";
import {
  Group,
  Pagination,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { GraduationCap, LoaderCircle, Search } from "lucide-react";
import { useCallback, useState } from "react";
const StudentsPage = () => {
  const admin = useAppSelector(selectUser);
  const { courses } = useFormData();
  const [query, setQuery] = useState({
    name: "",
    passportId: "",
    page: 1,
    limit: 12,
    year: currentYearQuery || "",
    courseId: "",
    orderBy: "asc",
  });
  const params = new URLSearchParams({
    name: query.name,
    page: query.page.toString(),
    limit: query.limit.toString(),
    year: query.year,
    passportId: query.passportId,
    courseId: query.courseId,
    orderBy: query.orderBy,
  });
  const { data, isPending } = useQuery<IAllStudentsResponse>({
    queryKey: [
      "students",
      "all",
      query.name,
      query.page,
      query.year,
      query.courseId,
      query.passportId,
      query.orderBy,
    ],
    queryFn: () =>
      Server<IAllStudentsResponse>(`students/all?${params}`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${admin?.token}`,
        },
      }),
    enabled: !!admin?.token,
  });
  const handleChangeOrder = useCallback(() => {
    setQuery((prev) => ({
      ...prev,
      orderBy: prev.orderBy === "asc" ? "desc" : "asc",
    }));
  }, []);
  return (
    <section>
      <Group mb="10" justify="space-between" align="center">
        <Group>
          <Text size="xl">O'quvchilar</Text>
          <GraduationCap />
        </Group>
        <Group>
          <TextInput
            className="self-end"
            fz="sm"
            size="sm"
            value={query.name}
            rightSection={
              isPending ? (
                <LoaderCircle size={16} className="animate-spin" />
              ) : (
                <Search size={16} />
              )
            }
            onChange={(event) =>
              setQuery({ ...query, name: event.target.value })
            }
            placeholder="O'quvchi ismi..."
          />
          <TextInput
            className="self-end"
            fz="sm"
            size="sm"
            value={query.passportId}
            rightSection={
              isPending ? (
                <LoaderCircle size={16} className="animate-spin" />
              ) : (
                <Search size={16} />
              )
            }
            onChange={(event) =>
              setQuery({ ...query, passportId: event.target.value })
            }
            placeholder="PassportId..."
          />
          <Select
            defaultValue={query.courseId}
            placeholder="Kurs..."
            data={courses}
            value={query.courseId.toString()}
            onChange={(value) => setQuery({ ...query, courseId: value || "" })}
            w={150}
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
      <Stack className="h-[calc(100vh_-_140px)]" justify="space-between">
        <StudentsTable handleChangeOrder={handleChangeOrder} students={data?.students || []} />
        <Pagination
          className="justify-end"
          value={query.page}
          hidden={(data?.totalPages ?? 0) <= 1 || isPending}
          onChange={(pageNumber) => setQuery({ ...query, page: pageNumber })}
          total={data?.totalPages || 1}
        />
      </Stack>
    </section>
  );
};
export default StudentsPage;
