import {
  Group,
  Container,
  Divider,
  Text,
  Image,
  ActionIcon,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getNews } from "@/admin/api/api.news";
import { Calendar, ArrowLeft } from "@/assets";
import { formatTime } from "@/utils/helper";
const NewsPreview = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { data: news } = useQuery({
    queryFn: () => getNews(slug || ""),
    queryKey: ["news", slug],
    enabled: !!slug,
  });
  return (
    <section className="pt-5">
      <Container>
        <Group justify="space-between">
          <Group>
            <ActionIcon
              onClick={() => navigate("/news")}
              variant="default"
              size="md"
              color="orange"
            >
              <Image src={ArrowLeft} alt="icon arrow left" />
            </ActionIcon>
            <Text>{news?.title}</Text>
          </Group>
          <Group>
            <Image w={20} src={Calendar} />
            <Text>{formatTime.DateTime(new Date(news?.createdAt || Date.now()))}</Text>
          </Group>
        </Group>
        <Divider mt="10" mb="30" />
        <div dangerouslySetInnerHTML={{ __html: news?.content || "" }}></div>
      </Container>
    </section>
  );
};
export default NewsPreview;