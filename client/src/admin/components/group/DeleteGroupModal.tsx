import { useDisclosure } from "@mantine/hooks";
import { Button, Group, Modal, Text } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "@/hooks/redux";
import {
  createNotification,
  showErrorNotification,
  showSuccessNotification,
} from "@/utils/notification";
import { useRef } from "react";
import { selectUser } from "@/lib/redux/reducer/admin";
import { Trash2 } from "lucide-react";
import { Server } from "@/api/api";
const DeleteGroupModal = ({
  id,
  disabled,
}: {
  id: number;
  disabled: boolean;
}) => {
  const admin = useAppSelector(selectUser);
  const [opened, { open, close }] = useDisclosure(false);
  const idNotification = useRef<string>("");
  const client = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (id: number) =>
      Server<IMessageResponse>(`group/delete/${id}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${admin?.token}`,
        },
      }),
    onSuccess: (success) => {
      showSuccessNotification(idNotification.current, success?.message);
      client.invalidateQueries({ queryKey: ["groups"] });
      close();
    },
    onError: (error) => {
      showErrorNotification(idNotification.current, error.message);
    },
  });
  const handleDelete = async () => {
    await mutateAsync(id);
    idNotification.current = createNotification(isPending);
  };
  return (
    <>
      <Button
        disabled={disabled}
        onClick={open}
        color="red"
        rightSection={<Trash2 size="16" />}
        size="xs"
        variant="outline"
      >
        O'chirish.
      </Button>
      <Modal
        centered
        opened={opened}
        onClose={close}
        title="O'qituvchini o'chirish"
      >
        <Text size="md" className="text-center">
          Siz ushbu Guruhni o'chirishni xohlaysizmi?
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
export default DeleteGroupModal;