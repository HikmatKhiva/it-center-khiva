import { useDisclosure } from "@mantine/hooks";
import { Button, Group, Modal, Text } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "@/hooks/redux";
import { Server } from "@/api/api";
import { selectUser } from "@/lib/redux/reducer/admin";
import { memo, useRef } from "react";
import { Trash2 } from "lucide-react";
import {
  createNotification,
  showErrorNotification,
  showSuccessNotification,
} from "@/utils/notification";
const DeleteStudentModal = memo(
  ({ id, groupId }: { id: number; groupId: number }) => {
    const admin = useAppSelector(selectUser);
    const [opened, { open, close }] = useDisclosure(false);
    const idNotification = useRef<string>("");
    const client = useQueryClient();
    const { mutateAsync, isPending } = useMutation({
      mutationFn: () =>
        Server<IMessageResponse>(`students/delete/${id}`, {
          method: "DELETE",
          headers: {
            authorization: `Bearer ${admin?.token}`,
          },
        }),
      onSuccess: (success) => {
        client.invalidateQueries({ queryKey: ["group", String(groupId)] });
        showSuccessNotification(idNotification.current, success?.message);
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
            Siz ushbu o'quvchini o'chirishni xohlaysizmi?
          </Text>
          {/* Confirmation message */}
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
  },
);
export default DeleteStudentModal;
