import { Server } from "@/api/api";
import { useAppSelector } from "@/hooks/redux";
import { selectUser } from "@/lib/redux/reducer/admin";
import {
  createNotification,
  showErrorNotification,
  showSuccessNotification,
} from "@/utils/notification";
import { Button, Group, Highlight, Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { useRef } from "react";

const NewStudentDeleteModal = ({
  id,
  fullName,
  isAttend,
}: {
  id: number;
  fullName: string;
  isAttend: string;
}) => {
  const admin = useAppSelector(selectUser);
  const client = useQueryClient();
  const idNotification = useRef<string>("");
  const [opened, { open, close }] = useDisclosure(false);

  const { mutateAsync: mutationDelete, isPending } = useMutation({
    mutationFn: () =>
      Server<IMessageResponse>(`newStudents/delete/${id}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${admin?.token}`,
        },
      }),
    mutationKey: ["delete", "newStudent", id],
    onSuccess: (success) => {
      client.invalidateQueries({ queryKey: ["newStudents"] });
      showSuccessNotification(idNotification.current, success?.message);
    },
    onError: (error) => {
      showErrorNotification(idNotification.current, error.message);
    },
  });
  const handleDelete = async () => {
    idNotification.current = createNotification(isPending);
    await mutationDelete();
  };
  return (
    <>
      <Modal opened={opened} onClose={close} size="md">
        <Text size="md" className="text-center">
          Siz
          <Highlight
            highlight={[fullName]}
            highlightStyles={{
              textTransform: "capitalize",
              textDecoration: "underline solid 1px",
            }}
          >
            {fullName}
          </Highlight>
          o'chirishni xohlaysizmi?
        </Text>
        <Group mt={20} justify="center" gap="10">
          <Button color="green" onClick={handleDelete}>
            Ha
          </Button>
          <Button color="red" variant="outline" onClick={close}>
            Yo'q
          </Button>
        </Group>
      </Modal>
      <Button
        disabled={["CAME", "NOT_CAME"].includes(isAttend)}
        variant="filled"
        color="red"
        size="compact-md"
        onClick={open}
      >
        <Trash size={14} />
      </Button>
    </>
  );
};

export default NewStudentDeleteModal;
