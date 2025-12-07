import GroupTable from "@/common/components/group/GroupTable";
import {
  TextInput,
  Group,
  Text,
  Select,
  Stack,
  Pagination,
} from "@mantine/core";
import { Filter, LoaderCircle, Search, Users } from "lucide-react";
import CreateGroupModal from "@/common/components/group/CreateGroupModal";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useAppSelector } from "@/hooks/redux";
import { Server } from "@/api/api";
import { selectUser } from "@/lib/redux/reducer/admin";
const AdminGroups = () => {
  const admin = useAppSelector(selectUser);
  const [query, setQuery] = useState({
    name: "",
    page: 1,
    limit: 12,
    isGroupFinished: false,
  });
  const params = new URLSearchParams({
    name: query.name,
    page: query.page.toString(),
    limit: query.limit.toString(),
    isGroupFinished: query.isGroupFinished.toString(),
  });
  const { data, isPending } = useQuery<GroupQueryResponse>({
    queryKey: ["groups", query.name, query.isGroupFinished, query.page],
    queryFn: () =>
      Server(`group?${params}`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${admin?.token}`,
        },
      }),
    enabled: !!admin?.token,
  });
  return (
    <section>
      <Group pb="20" justify="space-between">
        <Group>
          <Text size="lg" fw="bold">
            Guruhlarni boshqaruv bo'limi
          </Text>
          <Users />
        </Group>
        <Group>
          <Select
            defaultValue="false"
            rightSection={<Filter />}
            onChange={(value: string | null) =>
              setQuery((prev) => ({
                ...prev,
                isGroupFinished: value === "true",
              }))
            }
            data={[
              { value: "true", label: "Yakunlangan Guruhlar" },
              { value: "false", label: "Aktiv Guruhlar" },
            ]}
          />
          <TextInput
            w={230}
            value={query.name}
            fz="xs"
            rightSection={
              isPending ? (
                <LoaderCircle size={16} className="animate-spin" />
              ) : (
                <Search size={16} />
              )
            }
            onChange={(event) =>
              setQuery((prev) => ({ ...prev, name: event.target.value }))
            }
            placeholder="Guruh nomi orqali qidirish..."
          />
          <CreateGroupModal />
        </Group>
      </Group>
      <Stack className="h-[calc(100vh_-_150px)]" justify="space-between ">
        <GroupTable
          status={query.isGroupFinished}
          data={data?.groups || []}
          isPending={isPending}
        />
        <Pagination
          value={query.page}
          className="self-end"
          color="indigo"
          hidden={(data?.totalPages ?? 0) <= 1 || isPending}
          onChange={(pageNumber) => setQuery({ ...query, page: pageNumber })}
          total={data?.totalPages || 1}
        />
      </Stack>
    </section>
  );
};
export default AdminGroups;