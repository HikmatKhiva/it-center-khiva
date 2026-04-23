import { Server } from "@/api/api";
import { useAppSelector } from "@/hooks/redux";
import { selectUser } from "@/lib/redux/reducer/admin";
import {
  createNotification,
  showErrorNotification,
  showSuccessNotification,
} from "@/utils/notification";
import { Box, Button, Group, Highlight, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { useRef } from "react";
const RoomDeleteModal = ({ id, name }: { id: number; name: string }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const admin = useAppSelector(selectUser);
  const idNotification = useRef<string>("");
  const client = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: () =>
      Server<IMessageResponse>(`room/delete/${id}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${admin?.token}`,
        },
      }),
    mutationKey: ["room", "delete", id],
    onSuccess: (success) => {
      showSuccessNotification(idNotification.current, success?.message);
      client.invalidateQueries({ queryKey: ["rooms"] });
      close();
    },
    onError: (error) => {
      showErrorNotification(idNotification.current, error.message);
    },
  });

  const handleClick = async () => {
    idNotification.current = createNotification(true);
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
      <Modal centered opened={opened} onClose={close} title="Xonani o'chirish.">
        <Box size="md" className="text-center">
          Siz ushbu Xonani
          <Highlight
            ta="center"
            highlight={[name]}
            highlightStyles={{
              backgroundImage:
                "linear-gradient(45deg, var(--mantine-color-cyan-5), var(--mantine-color-indigo-5))",
              fontWeight: 700,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {name}
          </Highlight>
          o'chirishni xohlaysizmi?
        </Box>
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
export default RoomDeleteModal;