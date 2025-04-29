import { deleteReceptionAccount } from "@/admin/api/api.reception";
import { useAppSelector } from "@/hooks/redux";
import { selectUser } from "@/lib/redux/reducer/admin";
import {
  createNotification,
  showErrorNotification,
  showSuccessNotification,
} from "@/utils/notification";
import { Button, Group, Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { useRef } from "react";
const ReceptionDeleteModal = ({ id }: { id: number }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const admin = useAppSelector(selectUser);
  const idNotification = useRef<string>("");
  const client = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => deleteReceptionAccount(admin?.token || "", id),
    onSuccess: (success) => {
      showSuccessNotification(idNotification.current, success?.message);
      client.invalidateQueries({ queryKey: ["receptions"] });
      close();
    },
    onError: (error) => {
      showErrorNotification(idNotification.current, error.message);
    },
  });
  const handleClick = async () => {
    idNotification.current = createNotification(isPending);
    await mutateAsync();
  };
  return (
    <>
      <Button
        onClick={open}
        rightSection={<Trash size="16" />}
        color="red"
        size="xs"
        variant="outline"
      >
        O'chirish
      </Button>
      <Modal
        centered
        opened={opened}
        onClose={close}
        title="O'qituvchini o'chirish"
      >
        <Text size="md" className="text-center">
          Siz ushbu Hisobni o'chirishni xohlaysizmi?
        </Text>
        <Group mt={20} justify="end" gap="10">
          <Button
            loading={isPending}
            disabled={isPending}
            type="button"
            color="green"
            onClick={handleClick}
          >
            Ha
          </Button>
          <Button
            type="button"
            disabled={isPending}
            color="red"
            variant="outline"
            onClick={close}
          >
            Yo'q
          </Button>
        </Group>
      </Modal>
    </>
  );
};
export default ReceptionDeleteModal;