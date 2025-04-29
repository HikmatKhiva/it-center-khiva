import { getReceptionAccounts } from "@/admin/api/api.reception";
import ReceptionCreateModal from "@/admin/components/reception/ReceptionCreateModal";
import ReceptionTable from "@/admin/components/reception/ReceptionTable";
import { useAppSelector } from "@/hooks/redux";
import { selectUser } from "@/lib/redux/reducer/admin";
import { Group, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { ConciergeBell } from "lucide-react";
const AdminReception = () => {
  const admin = useAppSelector(selectUser);
  const { data } = useQuery<IReceptionResponse, Error>({
    queryFn: () => getReceptionAccounts(admin?.token || ""),
    queryKey: ["receptions"],
    enabled: !!admin?.token,
  });
  return (
    <section>
      <Group mb="10" justify="space-between">
        <Group>
          <Text size="lg" fw="bold">
            Reception boshqaruv bo'limi
          </Text>
          <ConciergeBell />
        </Group>
        <ReceptionCreateModal />
      </Group>
      <ReceptionTable profiles={data?.receptions || []} />
    </section>
  );
};
export default AdminReception;