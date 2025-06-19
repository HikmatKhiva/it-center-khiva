import StudentsChart from "@/common/charts/StudentsChart";
import DebtorStudentsReception from "@/common/components/debtors/DebtorStudentsReception";
import { Group, Text } from "@mantine/core";
import { House } from "lucide-react";
const ReceptionMainPage = () => {
  return (
    <section>
      <Group align="center" mt="10" mb="20">
        <Text size="24px">IT-Khiva Reception Paneli</Text>
        <House />
      </Group>
      <StudentsChart />
      <DebtorStudentsReception />
    </section>
  );
};
export default ReceptionMainPage;