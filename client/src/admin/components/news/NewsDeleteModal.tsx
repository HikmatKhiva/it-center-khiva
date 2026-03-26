import { useDisclosure } from "@mantine/hooks";
import { ActionIcon, Button, Group, Modal, Text } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useAppSelector } from "@/hooks/redux";
import { useRef } from "react";
import { selectUser } from "@/lib/redux/reducer/admin";
import {
  createNotification,
  showErrorNotification,
  showSuccessNotification,
} from "@/utils/notification";
import { Server } from "@/api/api";
import { IMessageResponse } from "@/types";
const NewsDeleteModal = ({ id }: { id: number }) => {
  const admin = useAppSelector(selectUser);
  const idNotification = useRef<string>("");
  const [opened, { open, close }] = useDisclosure(false);
  const client = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: () =>
      Server<IMessageResponse>(`news/delete/${id}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${admin?.token}`,
        },
      }),
    onSuccess: (success) => {
      client.invalidateQueries({ queryKey: ["news"] });
      showSuccessNotification(idNotification.current, success?.message);
      close();
    },
    onError: (error) => {
      showErrorNotification(idNotification.current, error.message);
    },
  });
  const handleDelete = async () => {
    idNotification.current = createNotification(isPending);
    mutateAsync();
  };
  return (
    <>
      <ActionIcon
        pos="absolute"
        onClick={open}
        color="red"
        right="0"
        size="md"
        variant="filled"
      >
        <Trash2 size="16" />
      </ActionIcon>
      <Modal
        centered
        opened={opened}
        onClose={close}
        title="Yangilikni o'chirish" // Optional title for clarity
      >
        <Text size="md" className="text-center">
          Siz ushbu yangilikni o'chirishni xohlaysizmi?
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
};
export default NewsDeleteModal;
