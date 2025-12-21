import {
  Group,
  Pagination,
  Skeleton,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import TimeCard from "./TimeCard";
import { NumberTicker } from "@/animation/number-ticker";
import { Search } from "lucide-react";
import { useAppSelector } from "@/hooks/redux";
import { selectUser } from "@/lib/redux/reducer/admin";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { RoomsQueryResponse } from "@/types";
import { Server } from "@/api/api";
const RoomsTab = ({ isActive }: { isActive: boolean }) => {
  const admin = useAppSelector(selectUser);
  const [query, setQuery] = useState({
    name: "",
    page: 1,
    limit: 10,
  });
  const params = new URLSearchParams({
    name: query.name,
    page: query.page.toString(),
    limit: query.limit.toString(),
  });
  const { data, isPending } = useQuery<RoomsQueryResponse>({
    queryKey: ["rooms", "schedules", query.name, query.page],
    queryFn: () =>
      Server(`room?${params}`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${admin?.token}`,
        },
      }),
    enabled: !!admin?.token && isActive,
  });
  const loadingCard = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  return (
    <section>
      <Group justify="space-between">
        <Group gap={5}>
          <Text size="lg" fw={700}>
            Xonalar:
          </Text>
          {data?.totalCount && <NumberTicker value={data?.totalCount} />}
        </Group>
        <TextInput
          size="xs"
          onChange={(event) => setQuery({ ...query, name: event.target.value })}
          placeholder="Xona nomi..."
          rightSection={<Search size="16" />}
        />
      </Group>
      <Stack className="h-[calc(100vh-260px)]" justify="space-between">
        <Group wrap="wrap" mt={10}>
          {Array.isArray(data?.rooms) && !isPending
            ? data?.rooms.map((room) => <TimeCard room={room} key={room.id} />)
            : loadingCard.map((number) => (
                <Skeleton key={number} w={200} h={230} />
              ))}
        </Group>
        <Pagination
          mt={20}
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

export default RoomsTab;
