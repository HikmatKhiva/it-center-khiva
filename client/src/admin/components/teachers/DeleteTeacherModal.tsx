import { useDisclosure } from "@mantine/hooks";
import { Button, Group, Modal, Text } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "@/hooks/redux";
import { selectUser } from "@/lib/redux/reducer/admin";
import { useRef } from "react";
import {
  createNotification,
  showErrorNotification,
  showSuccessNotification,
} from "@/utils/notification";
import { Trash2 } from "lucide-react";
import { Server } from "@/api/api";
const DeleteTeacherModal = ({ id }: { id: number }) => {
  const admin = useAppSelector(selectUser);
  const idNotification = useRef<string>("");
  const [opened, { open, close }] = useDisclosure(false);
  const client = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: () =>
      Server<IMessageResponse>(`teachers/delete/${id}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${admin?.token}`,
        },
      }),
    mutationKey: ["teacher", "delete", id],
    onSuccess: (success) => {
      showSuccessNotification(idNotification.current, success?.message);
      client.invalidateQueries({ queryKey: ["teachers"] });
      close();
    },
    onError: (error) => {
      showErrorNotification(idNotification.current, error.message);
    },
  });
  const handleDelete = async () => {
    idNotification.current = createNotification(isPending);
    await mutateAsync();
  };
  return (
    <>
      <Button onClick={open} color="red" size="xs" variant="outline">
        <Trash2 size="16" />
      </Button>
      <Modal
        centered
        opened={opened}
        onClose={close}
        title="O'quvchini o'chirish"
      >
        <Text size="md" className="text-center">
          Siz ushbu o'qituvchini o'chirishni xohlaysizmi?
        </Text>
        {/* Confirmation message */}
        <Group mt={20} justify="end" gap="10">
          <Button loading={isPending} color="green" onClick={handleDelete}>
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
export default DeleteTeacherModal;
