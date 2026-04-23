import { useQuery } from "@tanstack/react-query";
import NewStudentsTable from "@/common/components/newstudent/NewStudentsTable";
import {
  Group,
  Pagination,
  Select,
  Text,
  Loader,
  Indicator,
  Avatar,
  Stack,
  Modal,
  Button,
} from "@mantine/core";
import { BookOpenText, CalendarFold, Clock, Filter, Plus } from "lucide-react";
import {
  attends,
  courseTimes,
  currentYearQuery,
  selectMonths,
  years,
} from "@/config";
import { useState } from "react";
import { useAppSelector } from "@/hooks/redux";
import useFormData from "@/hooks/useFormData";
import { selectUser } from "@/lib/redux/reducer/admin";
import { Server } from "@/api/api";
import { useDisclosure } from "@mantine/hooks";
import AddNewStudent from "@/components/contact/AddNewStudent";
const NewStudents = () => {
  const user = useAppSelector(selectUser);
  const [opened, { open, close }] = useDisclosure(false);
  const [query, setQuery] = useState<IQueryStudent>({
    isAttend: "PENDING",
    month: (new Date().getMonth() + 1).toString(),
    courseTime: "",
    courseId: "",
    limit: 13,
    page: 1,
    year: currentYearQuery || "",
  });
  const params = new URLSearchParams({
    isAttend: query.isAttend,
    month: query.month,
    courseTime: query.courseTime,
    courseId: query.courseId,
    limit: query.limit.toString(),
    page: query.page.toString(),
    year: query.year,
  });
  const { data, isPending } = useQuery<INewStudentResponse>({
    queryFn: () =>
      Server<INewStudentResponse>(`newStudents?${params}`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${user?.token}`,
        },
      }),
    queryKey: [
      "newStudents",
      query.courseTime,
      query.isAttend,
      query.month,
      query.courseId,
      query.year,
      query.page
    ],
    enabled: !!user?.token,
  });
  const { courses, loading } = useFormData();
  return (
    <section>
      <Group mb="10" align="center" justify="space-between">
        <Group align="end">
          <Text>Yangi o'quvchilar</Text>
          <Indicator inline label={data?.countNewStudents} processing size={16}>
            <Avatar size={25} />
          </Indicator>
        </Group>
        <Group>
          <Select
            w={160}
            size="xs"
            leftSection={<Filter size="16" />}
            data={attends}
            value={query.isAttend}
            onChange={(value) => setQuery({ ...query, isAttend: value || "" })}
          />
          <Select
            w={130}
            size="xs"
            leftSection={<BookOpenText size="16" />}
            disabled={loading}
            data={courses}
            value={query.courseId}
            onChange={(value) => setQuery({ ...query, courseId: value || "" })}
          />

          <Select
            value={query.courseTime}
            size="xs"
            rightSection={<Clock size="16" />}
            w={130}
            onChange={(value) =>
              setQuery({ ...query, courseTime: value || "" })
            }
            data={courseTimes}
          />
          <Select
            size="xs"
            leftSection={<CalendarFold size="16" />}
            w={130}
            data={selectMonths}
            value={query.month}
            onChange={(value) => setQuery({ ...query, month: value || "" })}
          />
          <Select
            defaultValue={query.year}
            size="xs"
            placeholder="2025"
            data={years}
            value={query.year}
            onChange={(value) => setQuery({ ...query, year: value || "" })}
            w={90}
          />
          <Button
            size="xs"
            color="green"
            variant="filled"
            rightSection={<Plus size="14" />}
            onClick={open}
          >
            Qo'shish
          </Button>
        </Group>
      </Group>
      <Stack className="h-[calc(100vh_-_150px)]" justify="space-between">
        {isPending ? (
          <Loader
            pos="absolute"
            top="50%"
            className="translate-x-[50%] "
            left="55%"
            color="green"
            size="xl"
            type="dots"
          />
        ) : (
          <NewStudentsTable newStudents={data?.students || []} />
        )}
        <Pagination
          className="ml-auto pb-5"
          hidden={(data?.totalPages ?? 0) <= 1 || isPending}
          color="#40C057"
          total={data?.totalPages || 1}
          value={query.page}
          onChange={(pageNumber) => setQuery({ ...query, page: pageNumber })}
          mt="sm"
        />
      </Stack>
      <Modal opened={opened} onClose={close}>
        <AddNewStudent withBorder={false} shadow="none" />
      </Modal>
    </section>
  );
};
export default NewStudents;