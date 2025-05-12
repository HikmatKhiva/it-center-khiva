import { useDisclosure } from "@mantine/hooks";
import { Button, Group, Modal, Text } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, MutableRefObject } from "react";
import { Trash } from "lucide-react";
import { useAppSelector } from "@/hooks/redux";
import {
  createNotification,
  showErrorNotification,
  showSuccessNotification,
} from "@/utils/notification";
import { selectUser } from "@/lib/redux/reducer/admin";
import { Server } from "@/api/api";
const DeleteCourseModal = ({ id }: { id: number }) => {
  const admin = useAppSelector(selectUser);
  const [opened, { open, close }] = useDisclosure(false);
  const idNotification: MutableRefObject<string> = useRef("");
  const client = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: () =>
      Server<IMessageResponse>(`course/delete/${id}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${admin?.token || ""}`,
        },
      }),
    onSuccess: (success) => {
      showSuccessNotification(idNotification.current, success?.message);
      client.invalidateQueries({ queryKey: ["courses"] });
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
          Siz ushbu Kurni o'chirishni xohlaysizmi?
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
export default DeleteCourseModal;