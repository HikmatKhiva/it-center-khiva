import { Server } from "@/api/api";
import { useAppSelector } from "@/hooks/redux";
import { selectUser } from "@/lib/redux/reducer/admin";
import { BarChart } from "@mantine/charts";
import { useQuery } from "@tanstack/react-query";
const TeachersSalary = ({ isActive }: { isActive?: boolean }) => {
  const admin = useAppSelector(selectUser);
  const { data } = useQuery({
    queryFn: () =>
      Server<ITeacherChartResponse[]>(`stats/teachers`, {
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