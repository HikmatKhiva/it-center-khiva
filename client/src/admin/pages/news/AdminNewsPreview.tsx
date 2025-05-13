import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Divider, Group, Image, Text } from "@mantine/core";
import { ArrowLeft } from "lucide-react";
import { Server } from "@/api/api";
import { Calendar } from "@/assets";
import { formatTime } from "@/utils/helper";
const AdminNewsPreview = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data } = useQuery<INews>({
    queryFn: () => Server<INews>(`news/${slug}`, { method: "GET" }),
    queryKey: ["news", slug],
  });
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
        <Group justify="space-between" className="w-[90%]">
          <Text>Demo ko'rinishi</Text>
          <Group>
            <Image w={20} src={Calendar} />
            <Text>
              {formatTime.DateTime(new Date(data?.createdAt || Date.now()))}
            </Text>
          </Group>
        </Group>
      </Group>
      <Divider mt="10" mb="30" />
      <div dangerouslySetInnerHTML={{ __html: data?.content || "" }}></div>
    </section>
  );
};
export default AdminNewsPreview;
