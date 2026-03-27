import { Server } from "@/api/api";
import { useAppSelector } from "@/hooks/redux";
import { selectUser } from "@/lib/redux/reducer/admin";
import { BarChart } from "@mantine/charts";
import { Group, Select, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import StatCards from "../components/StatCards";
import { useState } from "react";
import { currentYearQuery, years } from "@/config";
const StudentsChart = ({ isActive }: { isActive?: boolean }) => {
  const admin = useAppSelector(selectUser);
  const [year, setYear] = useState<string>(currentYearQuery || "");
  const params = new URLSearchParams({
    year,
  });
  const { data } = useQuery({
    queryFn: () =>
      Server<IStats[]>(`stats?${params}`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${admin?.token}`,
        },
      }),
    queryKey: ["stats", year],
    enabled: !!admin?.token && isActive,
  });
  return (
    <>
      <Group mb={10} justify="space-between">
        <Text fw={700}>Statistika {data && data[0].yearFilter}</Text>
        <Select
          defaultValue={year}
          placeholder="2025"
          data={years}
          value={year}
          onChange={(value) => setYear(value || "")}
          w={90}
        />
      </Group>
      {data && <StatCards data={data} />}
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