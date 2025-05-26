import { Container, Group, Pagination, Text, Loader } from "@mantine/core";
import NewsCard from "@/components/news/NewsCard";
import { TextAnimate } from "@/animation/text-animation";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import EmptyPage from "@/components/EmptyPage";
import { Server } from "@/api/api";
const NewsPage = () => {
  const [query, setQuery] = useState({
    page: 1,
    limit: 10,
  });
  const params = new URLSearchParams({
    page: query.page.toString(),
    limit: query.limit.toString(),
  });
  const { data: newsData, isPending } = useQuery<INewsResponse>({
    queryFn: () =>
      Server<INewsResponse>(`news?${params}`, {
        method: "GET",
      }),
    queryKey: ["news"],
  });
  return (
    <section>
      <Container>
        <Text hidden={(newsData?.news?.length ?? 0) > 0} mt={30} fz={{ base: "xl", md: "30px" }} className="text-center">
          <TextAnimate animation="fadeIn" className="text-[#93CE03]">
            Yangiliklar
          </TextAnimate>
        </Text>
        <Group mt={30}>
          {isPending ? (
            <Loader
              pos="fixed"
              left="50%"
              top="50%"
              className="-translate-x-1/2"
              type="dots"
              size="xl"
              color="#93CE03"
            />
          ) : newsData?.news?.length === 0 ? (
            <EmptyPage />
          ) : (
            newsData?.news?.map((news: INews) => {
              return <NewsCard news={news} key={news.id} />;
            })
          )}
        </Group>
        <Pagination
          className="ml-auto pb-5"
          color="#40C057"
          total={newsData?.totalPages || 0}
          hidden={(newsData?.totalPages ?? 0) <= 1 || isPending}
          value={query.page}
          onChange={(pageNumber) => setQuery({ ...query, page: pageNumber })}
          mt="sm"
        />
      </Container>
    </section>
  );
};
export default NewsPage;
