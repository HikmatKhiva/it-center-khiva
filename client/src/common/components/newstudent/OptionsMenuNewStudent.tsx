import { Button, Menu } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Ellipsis, Trash2, X } from "lucide-react";
import { useRef, useState } from "react";
import { useAppSelector } from "@/hooks/redux";
import {
  createNotification,
  showErrorNotification,
  showSuccessNotification,
} from "@/utils/notification";
import { Server } from "@/api/api";
const OptionsMenuNewStudent = ({ id }: { id: number }) => {
  const { admin } = useAppSelector((state) => state.admin);
  const idNotification = useRef<string>("");
  const [opened, setOpened] = useState(false);
  const client = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: (status: string) =>
      Server<IMessageResponse>(`newStudents/update/${id}`, {
        method: "PUT",
        headers: {
          authorization: `Bearer ${admin?.token}`,
        },
        body: JSON.stringify({ status }),
      }),
    mutationKey: ["update", "newStudent", id],
    onSuccess: (success) => {
      client.invalidateQueries({ queryKey: ["newStudents"] });
      showSuccessNotification(idNotification.current, success?.message);
    },
    onError: (error) => {
      showErrorNotification(idNotification.current, error.message);
    },
  });
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
  const handleUpdateStatus = async (status: string) => {
    idNotification.current = createNotification(isPending);
    await mutateAsync(status);
  };
  const handleDelete = async () => {
    idNotification.current = createNotification(isPending);
    await mutationDelete();
  };
  return (
    <Menu opened={opened} onChange={setOpened} shadow="md">
      <Menu.Target>
        <Button size="xs" variant="default">
          <Ellipsis size="16" />
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          onClick={() => handleUpdateStatus("success")}
          rightSection={<Check size={14} />}
          color="green"
        >
          Darsga qatnashadigan
        </Menu.Item>
        <Menu.Item
          onClick={() => handleUpdateStatus("reject")}
          rightSection={<X size={14} />}
          color="red"
        >
          Darsga qatnashmaydigan
        </Menu.Item>
        <Menu.Item
          onClick={handleDelete}
          rightSection={<Trash2 size={14} />}
          color="red"
        >
          Ro'yxatdan o'chirish
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
export default OptionsMenuNewStudent;