import { CompositeChart } from "@mantine/charts";
const PaymentMonthly = ({ monthly }: { monthly: IPaymentMonthly[] }) => {
  return (
    <CompositeChart
      h={300}
      data={monthly}
      dataKey="month"
      maxBarWidth={30}
      tooltipAnimationDuration={300}
      series={[
        {
          name: "month",
          label: "Oy",
          color: "rgba(18, 120, 255, 0.2)",
          type: "bar",
        },
        {
          name: "payment",
          label: "To'lov miqdori",
          color: "red.8",
          type: "line",
        },
        {
          name: "paid",
          label: "To'langan summa",
          color: "yellow.8",
          type: "area",
        },
        { name: "percentage", label: "Foiz", color: "green.8", type: "area" },
      ]}
      curveType="monotone"
    />
  );
};
export default PaymentMonthly;