import StudentsChart from "@/common/charts/StudentsChart";
import DebtorStudentsReception from "@/common/components/debtors/DebtorStudentsReception";
import { Group, Tabs, Text } from "@mantine/core";
import { ChartNoAxesCombined, House, WalletCards } from "lucide-react";
import { useState } from "react";
const ReceptionMainPage = () => {
  const [activeTab, setActiveTab] = useState<string | null>("stats");

  return (
    <section>
      <Group align="center" mt="10" mb="20">
        <Text size="24px">IT-Khiva Reception Paneli</Text>
        <House />
      </Group>
      <Tabs
        defaultValue="stats"
        value={activeTab}
        onChange={setActiveTab}
        mb="20"
      >
        <Tabs.List mb="20">
          <Tabs.Tab
            fz="xl"
            value="stats"
            rightSection={<ChartNoAxesCombined size={16} />}
          >
            Statistika
          </Tabs.Tab>
          <Tabs.Tab
            fz="xl"
            value="debtors"
            rightSection={<WalletCards size={16} />}
          >
            Qarzdor O'quvchilar
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="stats">
          <StudentsChart isActive={activeTab === "stats"} />
        </Tabs.Panel>
        <Tabs.Panel value="debtors">
          <DebtorStudentsReception />
        </Tabs.Panel>
      </Tabs>
      
    </section>
  );
};
export default ReceptionMainPage;