import { Text } from "@mantine/core";
import AdminStats from "../sections/AdminStats";
import DebtorStudentsReception from "@/common/components/debtors/DebtorStudentsReception";
const AdminHome = () => {
  return (
    <section>
      <Text mt="10" size="24px">
        IT-Khiva Boshqaruv Paneli
      </Text>
      <AdminStats />
      <DebtorStudentsReception />
    </section>
  );
};
export default AdminHome;
