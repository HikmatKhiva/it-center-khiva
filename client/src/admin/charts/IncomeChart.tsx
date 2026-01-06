import { Server } from "@/api/api";
import { years } from "@/config";
import { useAppSelector } from "@/hooks/redux";
import { selectUser } from "@/lib/redux/reducer/admin";
import { IYearly } from "@/types";
import { CompositeChart } from "@mantine/charts";
import { Group, Select } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
const IncomeChart = ({ isActive }: { isActive?: boolean }) => {
  const admin = useAppSelector(selectUser);
  const currentYear = new Date().getFullYear().toString();
  const [year, setYear] = useState<string>(currentYear || "");
  const params = new URLSearchParams({
    year,
  });
  const { data } = useQuery<IYearly[]>({
    queryFn: () =>
      Server<IYearly[]>(`stats/yearly?${params}`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${admin?.token}`,
        },
      }),
    queryKey: ["stats", "income", year],
    enabled: !!admin?.token && isActive,
  });
  return (
    <>
      <Group justify="flex-end" mb={20}>
        <Select
          defaultValue={year}
          placeholder="2025"
          data={years}
          value={year}
          onChange={(value) => setYear(value || "")}
          w={90}
        />
      </Group>
      {data && (
        <CompositeChart
          h={350}
          data={data}
          dataKey="month"
          maxBarWidth={30}
          tooltipAnimationDuration={300}
          series={[
            {
              name: "expectedIncome",
              label: "Bu oygi tushum.",
              color: "rgba(18, 120, 255, 0.2)",
              type: "bar",
            },
            {
              name: "paidThisMonth",
              label: "Bu oygi to'langan.",
              color: "red.8",
              type: "line",
            },
            {
              name: "percentage",
              label: "Bu to'langan foiz.",
              color: "yellow.8",
              type: "area",
            },
          ]}
          curveType="linear"
        />
      )}
    </>
  );
};
export default IncomeChart;
