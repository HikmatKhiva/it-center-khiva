import GroupTable from "@/common/components/group/GroupTable";
import {
  TextInput,
  Group,
  Text,
  Select,
  Stack,
  Pagination,
} from "@mantine/core";
import { LoaderCircle, Search, Users } from "lucide-react";
import CreateGroupModal from "@/common/components/group/CreateGroupModal";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { useAppSelector } from "@/hooks/redux";
import { Server } from "@/api/api";
import { selectUser } from "@/lib/redux/reducer/admin";
import { currentYearQuery, years } from "@/config";
const AdminGroups = () => {
  const admin = useAppSelector(selectUser);
  const [query, setQuery] = useState({
    name: "",
    page: 1,
    limit: 12,
    isActive: "ACTIVE",
    year: currentYearQuery || "",
    orderBy: "asc",
  });
  const params = new URLSearchParams({
    name: query.name,
    page: query.page.toString(),
    limit: query.limit.toString(),
    isActive: query.isActive,
    year: query.year,
    orderBy: query.orderBy,
  });
  const { data, isPending } = useQuery<GroupQueryResponse>({
    queryKey: [
      "groups",
      query.name,
      query.isActive,
      query.page,
      query.year,
      query.orderBy,
    ],
    queryFn: () =>
      Server(`group?${params}`, {
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
      <Group pb="20" justify="space-between">
        <Group>
          <Text size="lg" fw="bold">
            Guruhlarni boshqaruv bo'limi
          </Text>
          <Users />
        </Group>
        <Group>
          <Select
            defaultValue="ACTIVE"
            w={160}
            size="sm"
            onChange={(value: string | null) =>
              setQuery((prev) => ({
                ...prev,
                isActive: value || "",
              }))
            }
            data={[
              { value: "FINISHED", label: "Yakunlangan" },
              { value: "ACTIVE", label: "Aktiv" },
              { value: "PENDING", label: "Faollashtirilmagan" },
            ]}
          />
          <TextInput
            w={180}
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
            size="sm"
            placeholder="Guruh nomi..."
          />
          <Select
            size="sm"
            defaultValue={query.year}
            placeholder="2025"
            data={years}
            value={query.year}
            onChange={(value) => setQuery({ ...query, year: value || "" })}
            w={90}
          />
          <CreateGroupModal />
        </Group>
      </Group>
      <Stack className="h-[calc(100vh_-_150px)]" justify="space-between ">
        <GroupTable
          handleChangeOrder={handleChangeOrder}
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
