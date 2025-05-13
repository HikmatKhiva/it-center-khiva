import { Button, Group, Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useAppSelector } from "@/hooks/redux";
import { selectUser } from "@/lib/redux/reducer/admin";
import { useRef } from "react";
import {
  createNotification,
  showErrorNotification,
  showSuccessNotification,
} from "@/utils/notification";
import { Server } from "@/api/api";
const ProfilePhotoDelete = ({ photo }: { photo: string | null }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const idNotification = useRef<string>("");
  const admin = useAppSelector(selectUser);
  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => Server<IMessageResponse>(``,{
      method: "DELETE",
      headers: {
        authorization: `Bearer ${admin?.token}`,
      },
    }),
    mutationKey: ["admin", "photo", "delete"],
    onSuccess: (success) => {
      showSuccessNotification(idNotification.current, success?.message);
      close();
    },
    onError: (error) => {
      showErrorNotification(idNotification.current, error.message);
    },
  });
  const handleDeleteImage = async () => {
    await mutateAsync();
    idNotification.current = createNotification(isPending);
  };
  return (
    <>
      <Button hidden={photo === null} onClick={open} size="xs" color="red">
        <Trash2 size="16" />
      </Button>
      <Modal size="sm" opened={opened} onClose={close}>
        <Text className="text-center">
          Ushbu rasmni o'chirishni xohlaysizmi?
        </Text>
        <Group justify="center" mt="md">
          <Button
            loading={isPending}
            disabled={isPending}
            size="xs"
            onClick={handleDeleteImage}
            color="red"
          >
            Ha
          </Button>
          <Button
            loading={isPending}
            disabled={isPending}
            size="xs"
            onClick={close}
            color="green"
          >
            Yo'q
          </Button>
        </Group>
      </Modal>
    </>
  );
};

export default ProfilePhotoDelete;
