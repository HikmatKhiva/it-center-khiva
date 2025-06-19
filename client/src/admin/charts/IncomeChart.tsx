import { Server } from "@/api/api";
import { useAppSelector } from "@/hooks/redux";
import { selectUser } from "@/lib/redux/reducer/admin";
import { CompositeChart } from "@mantine/charts";
import { useQuery } from "@tanstack/react-query";
const IncomeChart = ({ isActive }: { isActive?: boolean }) => {
  const admin = useAppSelector(selectUser);
  const { data } = useQuery<IYearly[]>({
    queryFn: () =>
      Server<IYearly[]>(`stats/yearly`, {
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