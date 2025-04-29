import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getNews } from "@/admin/api/api.news";
import { Button, Divider, Group, Text } from "@mantine/core";
import { ArrowLeft } from "lucide-react";
const AdminNewsPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data } = useQuery({
    queryFn: () => getNews(id || ""),
    queryKey: ["news", id],
  });
  const news = Array.isArray(data) && data[0];
  return (
    <section>
      <Group>
        <Button
          onClick={() => navigate(-1)}
          color="red"
          variant="outline"
          size="xs"
        >
          <ArrowLeft size={16} />
        </Button>
        <Text>Demo ko'rinishi</Text>
      </Group>
      <Divider mt="10" mb="30" />
      <div dangerouslySetInnerHTML={{ __html: news?.content }}></div>
    </section>
  );
};
export default AdminNewsPreview;