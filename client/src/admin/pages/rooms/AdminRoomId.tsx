import { Group, Select, Text } from "@mantine/core";
import { allTime, weekType } from "@/config";
import { DoorClosed, UsersRound } from "lucide-react";
import RoomGroup from "@/admin/components/rooms/RoomGroup";
import BackButton from "@/common/components/BackButton";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector } from "@/hooks/redux";
import { selectUser } from "@/lib/redux/reducer/admin";
import { Server } from "@/api/api";
import { useQuery } from "@tanstack/react-query";
const AdminRoomId = () => {
  const { id } = useParams();
  const admin = useAppSelector(selectUser);
  const [query, setQuery] = useState<IRoomQuery>({
    weekType: "",
    time: "",
  });
  const params = new URLSearchParams({
    weekType: query.weekType,
    time: query.time,
  });
  const { data, isPending } = useQuery<RoomQueryResponse>({
    queryKey: ["room", query.time, query.weekType],
    queryFn: () =>
      Server(`room/${id}?${params}`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${admin?.token}`,
        },
      }),
    enabled: !!admin?.token && !!id,
  });

  return (
    <>
      <Group justify="space-between" mb={15}>
        <Group>
          <BackButton />
          <Group>
            <Text>Xona nomi: {data?.name}</Text>
            <DoorClosed />
          </Group>
          <Group>
            <Text>Xona Sig'imi: {data?.capacity}</Text>
            <UsersRound />
          </Group>
        </Group>
        <Group>
          <Select
            onChange={(value) => setQuery({ ...query, weekType: value || "" })}
            placeholder="Toq | Juft"
            size="xs"
            disabled={isPending}
            data={weekType}
            w={120}
          />
          <Select
            disabled={isPending}
            onChange={(value) => setQuery({ ...query, time: value || "" })}
            placeholder="9:00"
            size="xs"
            data={allTime}
            w={120}
          />
        </Group>
      </Group>
      <RoomGroup schedules={data?.schedules || []} />
    </>
  );
};

export default AdminRoomId;
