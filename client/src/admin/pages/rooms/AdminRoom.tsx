import { Group, Pagination, Stack, Text, TextInput } from "@mantine/core";
import RoomsTable from "@/admin/components/rooms/RoomsTable";
import { DoorClosed, LoaderCircle, Search } from "lucide-react";
import RoomCreateModal from "@/admin/components/rooms/RoomCreateModal";
import { useState } from "react";
import { useAppSelector } from "@/hooks/redux";
import { selectUser } from "@/lib/redux/reducer/admin";
import { useQuery } from "@tanstack/react-query";
import { Server } from "@/api/api";
const AdminRoom = () => {
  const admin = useAppSelector(selectUser);
  const [query, setQuery] = useState({
    name: "",
    page: 1,
    limit: 12,
  });
  const params = new URLSearchParams({
    name: query.name,
    page: query.page.toString(),
    limit: query.limit.toString(),
  });
  const { data, isPending } = useQuery<RoomsQueryResponse>({
    queryKey: ["rooms", query.name, query.page],
    queryFn: () =>
      Server(`room?${params}`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${admin?.token}`,
        },
      }),
    enabled: !!admin?.token,
  });

  return (
    <section>
      <Group mb="10" justify="space-between">
        <Group>
          <Text>Xonalar boshqaruv bo'limi</Text>
          <DoorClosed />
        </Group>
        <Group>
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
            placeholder="Xona nomi orqali qidirish..."
          />
          <RoomCreateModal />
        </Group>
      </Group>
      <Stack className="h-[calc(100vh_-_150px)]" justify="space-between ">
        <RoomsTable rooms={data?.rooms || []} />
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
export default AdminRoom;
