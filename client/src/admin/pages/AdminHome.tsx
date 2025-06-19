import { Tabs, Text } from "@mantine/core";
import DebtorStudentsReception from "@/common/components/debtors/DebtorStudentsReception";
import StudentsChart from "@/common/charts/StudentsChart";
import IncomeChart from "@/admin/charts/IncomeChart";
import TeachersSalary from "../charts/TeachersSalary";
import { useState } from "react";
import { Banknote, ChartCandlestick, ChartNoAxesCombined } from "lucide-react";
const AdminHome = () => {
  const [activeTab, setActiveTab] = useState<string | null>("stats");
  return (
    <section>
      <Text mt="10" mb="20" size="24px">
        IT-Khiva Boshqaruv Paneli
      </Text>
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
            value="income"
            rightSection={<ChartCandlestick size={16} />}
          >
            Yillik to'lovlar
          </Tabs.Tab>
          <Tabs.Tab
            fz="xl"
            value="teachers"
            rightSection={<Banknote size={16} />}
          >
            O'qituvchilar maoshlari
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="stats">
          <StudentsChart isActive={activeTab === "stats"} />
        </Tabs.Panel>
        <Tabs.Panel value="income">
          <IncomeChart isActive={activeTab === "income"} />
        </Tabs.Panel>

        <Tabs.Panel value="teachers">
          <TeachersSalary isActive={activeTab === "teachers"} />
        </Tabs.Panel>
      </Tabs>
      <DebtorStudentsReception />
    </section>
  );
};
export default AdminHome;
