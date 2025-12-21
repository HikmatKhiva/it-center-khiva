import { Server } from "@/api/api";
import { useAppSelector } from "@/hooks/redux";
import { selectUser } from "@/lib/redux/reducer/admin";
import { IStats } from "@/types";
import { BarChart } from "@mantine/charts";
import { Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import StatCards from "../components/StatCards";
const StudentsChart = ({ isActive }: { isActive?: boolean }) => {
  const admin = useAppSelector(selectUser);
  const { data } = useQuery({
    queryFn: () =>
      Server<IStats[]>(`stats`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${admin?.token}`,
        },
      }),
    queryKey: ["stats"],
    enabled: !!admin?.token && isActive,
  });
  return (
    <>
      <Text fw={700} mb={10}>
        Statistika{" "}
      </Text>
      {data && <StatCards data={data || []} />}
      {data && (
        <BarChart
          mb="20"
          h={350}
          data={data}
          dataKey="stat"
          tooltipAnimationDuration={300}
          series={[
            {
              name: "activeGroups",
              label: "Hozirda ochiq guruhlar",
              color: "teal.6",
            },
            {
              name: "totalCourses",
              label: "Hozirda mavjud kurslar",
              color: "blue.6",
            },
            {
              name: "activeStudents",
              label: "Hozirda o'qiyotgan o'quvchilar",
              color: "indigo.6",
            },
            { name: "totalTeachers", label: "O'qituvchilar", color: "grape.6" },
            {
              name: "totalMaleStudents",
              label: "O'qiyotgan Erkak o'quvchilar",
              color: "violet.6",
            },
            {
              name: "totalFemaleStudents",
              label: "O'qiyotgan Ayol o'quvchilar",
              color: "pink.6",
            },
            {
              name: "totalStudents",
              label: "O'qiyotgan umumiy o'quvchilar",
              color: "cyan.6",
            },
            {
              name: "finishedStudents",
              label: "Yakunlagan umumiy o'quvchilar",
              color: "red.6",
            },
            {
              name: "totalFinishedMaleStudents",
              label: "Yakunlagan Erkak o'quvchilar",
              color: "violet.6",
            },
            {
              name: "totalFinishedFemaleStudents",
              label: "Yakunlagan Ayol o'quvchilar",
              color: "pink.6",
            },
            {
              name: "finishedGroups",
              label: "Yakunlangan guruhlar",
              color: "orange.6",
            },
            {
              name: "totalDebtors",
              label: "Umumiy qarzdor o'quvchilar",
              color: "red.9",
            },
          ]}
          tickLine="y"
          gridAxis="x"
          withXAxis={false}
          withYAxis={false}
        />
      )}
    </>
  );
};
export default StudentsChart;
