import { useDisclosure } from "@mantine/hooks";
import { ActionIcon, Button, Group, Modal, Text } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { deleteMessage } from "@/admin/api/api.message";
import { useRef } from "react";
import { useAppSelector } from "@/hooks/redux";
import {
  createNotification,
  showErrorNotification,
  showSuccessNotification,
} from "@/utils/notification";
const MessageDeleteModal = ({ id }: { id: number }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const { admin } = useAppSelector((state) => state.admin);
  const client = useQueryClient();
  const idNotification = useRef<string>("");
  const { mutateAsync, isPending } = useMutation({
    mutationFn: () =>
      admin?.token ? deleteMessage(id, admin.token || "") : Promise.reject(),
    onSuccess: (success) => {
      client.invalidateQueries({ queryKey: ["message"] });
      showSuccessNotification(idNotification.current, success?.message);
      close();
    },
    onError: (error) => {
      showErrorNotification(idNotification.current, error.message);
    },
  });
  const handleDelete = () => {
    idNotification.current = createNotification(isPending);
    mutateAsync();
  };
  return (
    <>
      <ActionIcon
        onClick={open}
        bottom="5px"
        right="5px"
        color="red"
        pos="absolute"
        p="3"
      >
        <Trash2 />
      </ActionIcon>
      <Modal
        centered
        opened={opened}
        onClose={close}
        title="Xabarni o'chirish."
      >
        <Text size="md" className="text-center">
          Siz ushbu Xabarni o'chirishni xohlaysizmi?
        </Text>
        <Group mt={20} justify="end" gap="10">
          <Button color="green" onClick={handleDelete}>
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
export default MessageDeleteModal;