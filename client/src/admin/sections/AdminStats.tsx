import { Card, Group, Stack, Text } from "@mantine/core";
import {
  CourseSVG,
  GroupSVG,
  StudentSVG,
  TeacherSVG,
} from "../../motions_components";
import { useQuery } from "@tanstack/react-query";
import { getAdminStats } from "../api/api.group";
import { NumberTicker } from "../../animation/number-ticker";
import StatsCardSkeleton from "../loading/StatsCardSkeleton";
import { useAppSelector } from "../../hooks/redux";
const AdminStats = () => {
  const { admin } = useAppSelector((state) => state.admin);
  const { data, isLoading } = useQuery({
    queryFn: () => getAdminStats(admin?.token || ""),
    queryKey: ["stats"],
    enabled: !!admin?.token,
  });

  return (
    <>
      {!isLoading ? (
        <div className="flex flex-wrap ">
          <Card w="250" shadow="lg" padding="xl" radius="lg" className="m-5">
            <Stack justify="space-between">
              <Group align="center" justify="space-between">
                <Text size="lg">Talabalar</Text>
                <StudentSVG />
              </Group>
              <NumberTicker
                className="text-2xl"
                value={parseInt(data?.active_students_count)}
              />
            </Stack>
          </Card>
          <Card w="250" shadow="lg" padding="xl" radius="lg" className="m-5">
            <Stack justify="space-between">
              <Group align="center" justify="space-between">
                <Text size="lg">Guruhlar</Text>
                <GroupSVG />
              </Group>
              <NumberTicker
                className="text-2xl"
                value={parseInt(data?.active_groups_count)}
              />
            </Stack>
          </Card>
          <Card w="250" shadow="lg" padding="xl" radius="lg" className="m-5">
            <Stack justify="space-between">
              <Group align="center" justify="space-between">
                <Text size="lg">O'qituvchilar</Text>
                <TeacherSVG />
              </Group>
              <NumberTicker
                className="text-2xl"
                value={parseInt(data?.total_teachers_count)}
              />
            </Stack>
          </Card>
          <Card w="250" shadow="lg" padding="xl" radius="lg" className="m-5">
            <Stack justify="space-between">
              <Group align="center" justify="space-between">
                <Text size="lg">Kurslar</Text>
                <CourseSVG />
              </Group>
              <Text>
                <NumberTicker
                  className="text-2xl"
                  value={parseInt(data?.total_courses_count)}
                />
              </Text>
            </Stack>
          </Card>
        </div>
      ) : (
        <Group gap={1}>
          {[1, 2, 3, 4].map((_) => (
            <StatsCardSkeleton key={_} />
          ))}
        </Group>
      )}
    </>
  );
};
export default AdminStats;
