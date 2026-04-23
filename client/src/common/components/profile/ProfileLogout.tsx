import { useAppDispatch } from "@/hooks/redux";
import { logout } from "@/lib/redux/reducer/admin";
import { Button, Group, Modal, Text } from "@mantine/core";
import { useNavigate } from "react-router-dom";
const ProfileLogout = ({
  opened = false,
  close,
}: {
  opened: boolean;
  close: () => void;
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate("/");
    dispatch(logout());
  };
  return (
    <>
      <Modal centered opened={opened} onClose={close} title="Hisobdan chiqish">
        <Text size="md" className="text-center">
          Siz Hisobdan chiqishni xohlaysizmi?
        </Text>
        <Group mt={20} justify="end" gap="10">
          <Button color="green" onClick={handleLogout}>
            Ha
          </Button>
          <Button color="red" variant="outline" onClick={close}>
            Yo'q
          </Button>
        </Group>
      </Modal>
    </>
  );
};
export default ProfileLogout;