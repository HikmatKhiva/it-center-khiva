import { Button, Card, Group, Image, Text } from "@mantine/core";
import { CoolMode } from "../../animation/cool-mode";
import { useNavigate } from "react-router-dom";
const NewsCard = ({ news }: { news: INews }) => {
  const navigate = useNavigate();
  return (
    <Card w="calc(300px - 2px)" shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Image src={news.photo_url} h={250} alt={news.title} />
      </Card.Section>
      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500}>{news.title}</Text>
      </Group>
      <Text size="sm" c="dimmed">
        {news.description}
      </Text>
      <CoolMode>
        <Button
          type="button"
          onClick={() => navigate(`/news/${news.slug}`)}
          aria-label="example news button"
          className="mt-2"
          color="green"
          fz="sm"
        >
          Batafsil
        </Button>
      </CoolMode>
    </Card>
  );
};

export default NewsCard;
