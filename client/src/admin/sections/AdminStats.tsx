import { Card, Group, Stack, Text } from "@mantine/core";
import {
  CourseSVG,
  GroupSVG,
  StudentSVG,
  TeacherSVG,
} from "@/motions_components";
import { useQuery } from "@tanstack/react-query";
import { NumberTicker } from "@/animation/number-ticker";
import StatsCardSkeleton from "@/admin/loading/StatsCardSkeleton";
import { useAppSelector } from "@/hooks/redux";
import { Server } from "@/api/api";
import { selectUser } from "@/lib/redux/reducer/admin";
const AdminStats = () => {
  const admin = useAppSelector(selectUser);
  const { data, isLoading } = useQuery<IStats>({
    queryFn: () =>
      Server<IStats>(`stats`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${admin?.token}`,
        },
      }),
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
                value={data?.totalStudents ?? 0}
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
                value={data?.activeGroups ?? 0}
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
                value={data?.totalTeachers ?? 0}
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
                  value={data?.totalCourses ?? 0}
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