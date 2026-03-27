import {
  Group,
  Indicator,
  Pagination,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useAppSelector } from "@/hooks/redux";
import { selectUser } from "@/lib/redux/reducer/admin";
import { Mails, Search } from "lucide-react";
import { Server } from "@/api/api";
import MessagesTable from "@/admin/components/messages/MessagesTable";
const AdminMessages = () => {
  const admin = useAppSelector(selectUser);
  const [query, setQuery] = useState({
    name: "",
    limit: 9,
    page: 1,
  });
  const params = new URLSearchParams({
    name: query.name,
    limit: query.limit.toString(),
    page: query.page.toString(),
  });
  const { data, isPending } = useQuery<IMessagesResponse>({
    queryFn: () =>
      Server(`admin/messages?${params}`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${admin?.token}`,
        },
      }),
    queryKey: ["message", query.page, query.name],
    enabled: !!admin?.token,
  });
  return (
    <section className="h-[calc(100vh-100px)] ">
      <Group pb="10" justify="space-between">
        <Group>
          <Text size="lg" fw="bold">
            Xabarlar boshqaruv bo'limi.
          </Text>
          <Indicator inline label={data?.totalCount} processing size={16}>
            <Mails />
          </Indicator>
        </Group>
        <TextInput
          rightSection={<Search size={16} />}
          onChange={(event) =>
            setQuery((prev) => ({ ...prev, name: event.target.value }))
          }
          size="sm"
          value={query.name}
          placeholder="Xabar qidirish..."
        />
      </Group>
      <Stack mt={9} justify="space-between" className="h-[calc(100vh_-_160px)]">
        <Group justify="center" wrap="wrap">
          {data?.messages && <MessagesTable messages={data.messages} />}
        </Group>
        <Pagination
          className="ml-auto pb-5"
          color="#40C057"
          total={data?.totalPages || 1}
          hidden={(data?.totalPages ?? 0) <= 1 || isPending}
          value={query.page}
          onChange={(event) => setQuery({ ...query, page: event })}
          mt="sm"
        />
      </Stack>
    </section>
  );
};
export default AdminMessages;