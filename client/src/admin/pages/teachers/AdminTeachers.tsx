import TeachersTable from "@/admin/components/teachers/TeachersTable";
import { TextInput, Group, Text, Pagination, Stack } from "@mantine/core";
import { LoaderCircle, Search, User } from "lucide-react";
import CreateTeacherModal from "../../components/teachers/CreateTeacherModal";
import { useQuery } from "@tanstack/react-query";
import { getAllTeachers } from "@/admin/api/api.teachers";
import { useState } from "react";
import { useAppSelector } from "@/hooks/redux";
import { selectUser } from "@/lib/redux/reducer/admin";
const AdminTeachers = () => {
  const admin = useAppSelector(selectUser);
  const [query, setQuery] = useState({
    name: "",
    page: 1,
    limit: 10,
  });
  const { data, isPending } = useQuery<ITeacherResponse>({
    queryKey: ["teachers", query.name, query.page],
    queryFn: () => getAllTeachers(query, admin?.token || ""),
    enabled: !!admin?.token,
  });
  return (
    <section>
      <Group pb="10" justify="space-between">
        <Group>
          <Text size="lg" fw="bold">
            O'qituvchilar boshqaruv bo'limi.
          </Text>
          <User />
        </Group>
        <Group>
          <TextInput
            fz="sm"
            value={query.name}
            rightSection={
              isPending ? (
                <LoaderCircle size={16} className="animate-spin" />
              ) : (
                <Search size={16} />
              )
            }
            onChange={(event) =>
              setQuery({ ...query, name: event.currentTarget.value })
            }
            className=""
            placeholder="O'qituvchi qidirish"
          />
          <CreateTeacherModal />
        </Group>
      </Group>
      <Stack className="h-[calc(100vh_-_140px)] " justify="space-between">
        <TeachersTable teachers={data?.teachers || []} />
        <Pagination
          value={query.page}
          hidden={(data?.totalPages ?? 0) <= 1 || isPending}
          onChange={(pageNumber) => setQuery({ ...query, page: pageNumber })}
          total={data?.totalPages || 1}
        />
      </Stack>
    </section>
  );
};
export default AdminTeachers;
