import { useDisclosure } from "@mantine/hooks";
import { Button, Group, Modal, Text } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteStudent } from "@/admin/api/api.student";
import { useAppSelector } from "@/hooks/redux";

const DeleteStudentModal = ({ id }: { id: number }) => {
  const { admin } = useAppSelector((state) => state.admin);
  const [opened, { open, close }] = useDisclosure(false);
  const client = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: () => deleteStudent(id, admin?.token || ""),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["students"] });
    },
  });
  const handleDelete = async () => {
    await mutateAsync();
  };
  return (
    <>
      <Button onClick={open} color="red" size="xs" variant="outline">
        O'chirish 🗑️
      </Button>
      <Modal
        centered
        opened={opened}
        onClose={close}
        title="O'qituvchini o'chirish" // Optional title for clarity
      >
        <Text size="md" className="text-center">
          Siz ushbu o'qituvchini o'chirishni xohlaysizmi?
        </Text>
        {/* Confirmation message */}
        <Group mt={20} justify="end" gap="10">
          <Button
            color="green"
            onClick={handleDelete}
          >
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
export default DeleteStudentModal;
