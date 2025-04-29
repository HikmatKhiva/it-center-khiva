import { Divider, Group, Pagination, Stack, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { getMessages } from "@/admin/api/api.message";
import { useState } from "react";
import MessageCard from "../../components/messages/MessageCard";
import { useAppSelector } from "@/hooks/redux";
import { selectUser } from "@/lib/redux/reducer/admin";
import { Mails } from "lucide-react";
const AdminMessages = () => {
  const admin = useAppSelector(selectUser);
  const [query, setQuery] = useState({
    limit: 9,
    page: 1,
  });
  const { data,isPending } = useQuery<IMessagesResponse>({
    queryFn: () => getMessages(query, admin?.token || ""),
    queryKey: ["message", query.page],
    enabled: !!admin?.token,
  });
  return (
    <section className="h-[calc(100vh_-_100px)] ">
      <Group pb="10" justify="space-between">
        <Group>
          <Text size="lg" fw="bold">
            Xabarlar boshqaruv bo'limi.
          </Text>
          <Mails />
        </Group>
      </Group>
      <Divider mb="40" />
      <Stack justify="space-between" className="h-[calc(100vh_-_160px)]">
        <Group justify="center" wrap="wrap"  >
          {data?.messages?.map((m: IMessage) => (
            <MessageCard message={m} key={m.id} />
          ))}
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
