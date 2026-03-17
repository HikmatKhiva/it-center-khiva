import { Server } from "@/api/api";
import { selectMonths, years } from "@/config";
import { useAppSelector } from "@/hooks/redux";
import { selectUser } from "@/lib/redux/reducer/admin";
import { ITeacherChartResponse } from "@/types";
import { BarChart } from "@mantine/charts";
import { Group, Select } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
const TeachersSalary = ({ isActive }: { isActive?: boolean }) => {
  const admin = useAppSelector(selectUser);
  const current = new Date();
  const [query, setQuery] = useState({
    year: current.getFullYear().toString() || "",
    month: String(current.getMonth() + 1) || "",
  });
  const params = new URLSearchParams({
    year: query.year,
    month: query.month,
  });
  const { data } = useQuery({
    queryFn: () =>
      Server<ITeacherChartResponse[]>(`stats/teachers?${params}`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${admin?.token}`,
        },
      }),
    queryKey: ["stats", "teachers", "salary", query.year, query.month],
    enabled: !!admin?.token && isActive,
  });
  return (
    <>
      <Group justify="flex-end" mb={20}>
        <Select
          defaultValue={query.year}
          placeholder="2025"
          data={years}
          value={query.year}
          onChange={(value) =>
            setQuery((prev) => ({ ...prev, year: value || "" }))
          }
          w={90}
        />
        <Select
          defaultValue={query.month}
          placeholder="Month"
          data={selectMonths}
          value={query.month}
          onChange={(value) =>
            setQuery((prev) => ({ ...prev, month: value || "" }))
          }
          w={120}
        />
      </Group>
      {data && (
        <BarChart
          h={350}
          data={data}
          dataKey="teacherName"
          series={[
            {
              name: "totalPaid",
              label: "Umumiy to'langan summa",
              color: "violet.6",
            },
            {
              name: "totalSalary",
              label: "O'qituvchini umumiy maosh",
              color: "blue.6",
            },
            {
              name: "expectedSalary",
              label: "O'qituvchini kutilayotgan maoshi",
              color: "teal.6",
            },
            { name: "totalAmount", label: "To'liq summa", color: "grape.6" },
          ]}
          tickLine="y"
        />
      )}
    </>
  );
};
export default TeachersSalary;
