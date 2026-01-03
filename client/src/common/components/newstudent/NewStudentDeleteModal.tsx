import { Server } from "@/api/api";
import { useAppSelector } from "@/hooks/redux";
import { selectUser } from "@/lib/redux/reducer/admin";
import { IMessageResponse } from "@/types";
import {
  createNotification,
  showErrorNotification,
  showSuccessNotification,
} from "@/utils/notification";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";

const NewStudentDeleteModal = ({ id }: { id: number }) => {
  const admin = useAppSelector(selectUser);
  const client = useQueryClient();
  const idNotification = useRef<string>("");

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
  return <div>NewStudentDeleteModal</div>;
};

export default NewStudentDeleteModal;
