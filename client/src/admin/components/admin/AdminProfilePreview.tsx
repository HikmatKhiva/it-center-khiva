import { Button, Divider, Group, Text } from "@mantine/core";
import { useAppSelector } from "../../../hooks/redux";
import { LogOut, Mail, UserRound } from "lucide-react";
const AdminProfilePreview = () => {
  const { admin } = useAppSelector((state) => state.admin);
  return (
    <div>
      <Group mb="5">
        <UserRound />
        <Text className="capitalize ">{admin?.username}</Text>
      </Group>
      <Divider my={10} />
      <Group mb="5">
        <Mail />
        <Text>{admin?.email}</Text>
      </Group>
      <Divider mb={20} />
      <Button color="violet" rightSection={<LogOut size="18" />}>Hisobdan chiqish</Button>
    </div>
  );
};
export default AdminProfilePreview;
