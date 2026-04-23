import RoomGroup from "@/admin/components/rooms/RoomGroup";
import { Server } from "@/api/api";
import { weekType } from "@/config";
import { useAppSelector } from "@/hooks/redux";
import { selectUser } from "@/lib/redux/reducer/admin";
import { Drawer, Group, Select, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { DoorClosed, UsersRound } from "lucide-react";
import { useState } from "react";
const DrawerTable = ({
  opened = false,
  id,
  close,
}: {
  opened: boolean;
  id: number;
  close: () => void;
}) => {
  const admin = useAppSelector(selectUser);
  const [query, setQuery] = useState<IRoomQuery>({
    weekType: "",
    time: "",
  });
  const params = new URLSearchParams({
    weekType: query.weekType,
  });
  const { data, isPending } = useQuery<RoomQueryResponse>({
    queryKey: ["room", id, query.time, query.weekType],
    queryFn: () =>
      Server(`room/${id}?${params}`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${admin?.token}`,
        },
      }),
    enabled: !!admin?.token && (!!id && opened),
  });
  return (
    <>
      <Drawer
        position="right"
        size="lg"
        offset={8}
        radius="md"
        opened={opened}
        transitionProps={{
          transition: "rotate-left",
          duration: 150,
          timingFunction: "linear",
        }}
        onClose={close}
      >
        <Group justify="space-between" mb={15}>
          <Group>
            <Text>Xona nomi: {data?.name}</Text>
            <DoorClosed />
            <Group>
              <Text>Xona Sig'imi: {data?.capacity}</Text>
              <UsersRound />
            </Group>
          </Group>
          <Group>
            <Select
              onChange={(value) =>
                setQuery({ ...query, weekType: value || "" })
              }
              placeholder="Toq | Juft"
              size="xs"
              disabled={isPending}
              data={weekType}
              w={120}
            />
          </Group>
        </Group>
        {data?.schedules && <RoomGroup schedules={data?.schedules} />}
      </Drawer>
    </>
  );
};

export default DrawerTable;
