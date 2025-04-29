import {
  Divider,
  TextInput,
  Group,
  Text,
  Button,
  Pagination,
} from "@mantine/core";
import { Newspaper, Pencil, Search } from "lucide-react";
import AdminNewsCard from "@/admin/components/news/AdminNewsCard";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllNews } from "@/admin/api/api.news";
import { useState } from "react";
const AdminNews = () => {
  const [query, setQuery] = useState({
    name: "",
    page: 1,
    limit: 10,
  });
  const { data, isPending } = useQuery({
    queryFn: () => getAllNews(query),
    queryKey: ["news", query.name, query.page],
  });
  return (
    <section>
      <Group pb="20" justify="space-between">
        <Group>
          <Text size="lg" fw="bold">
            Yangiliklar boshqaruv bo'limi
          </Text>
          <Newspaper />
        </Group>
        <Group>
          <TextInput
            rightSection={<Search size={16} />}
            fz={"xs"}
            onChange={(event) =>
              setQuery((prev) => ({ ...prev, name: event.target.value }))
            }
            value={query.name}
            placeholder="Izlash..."
          />
          <Link to="/admin/news/create">
            <Button
              rightSection={<Pencil size={16} />}
              fz={"xs"}
              aria-label="navigate create news"
              aria-labelledby="navigate create news"
              color="green"
              type="button"
              variant="filled"
            >
              Yangilik Yaratish.
            </Button>
          </Link>
        </Group>
      </Group>
      <Divider py={10} />
      <div className="flex flex-wrap gap-5">
        {data?.news?.map((news: INews) => (
          <AdminNewsCard news={news} key={news.id} />
        ))}
      </div>
      <Pagination
        className="ml-auto pb-5"
        color="#40C057"
        hidden={(data?.totalPages ?? 0) <= 1 || isPending}
        total={data?.totalPages || 0}
        value={query.page}
        onChange={(pageNumber) => setQuery({ ...query, page: pageNumber })}
        mt="sm"
      />
    </section>
  );
};
export default AdminNews;