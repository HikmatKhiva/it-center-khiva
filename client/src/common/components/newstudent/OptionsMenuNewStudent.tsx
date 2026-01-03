import {
  Button,
  Group,
  Menu,
  Modal,
  Select,
  Table,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Ellipsis, Settings, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "@/hooks/redux";
import {
  createNotification,
  showErrorNotification,
  showSuccessNotification,
} from "@/utils/notification";
import { Server } from "@/api/api";
import { IMessageResponse, INewStudent, INewStudentUpdate } from "@/types";
import { useDisclosure } from "@mantine/hooks";
import { selectUser } from "@/lib/redux/reducer/admin";
import { formatTime } from "@/utils/helper";
import { attends } from "@/config";
import { useForm } from "@mantine/form";
import { updateNewStudentValidation } from "@/validation";
import useFormData from "@/hooks/useFormData";
const OptionsMenuNewStudent = ({
  id,
  student,
}: {
  id: number;
  student: INewStudent;
}) => {
  const admin = useAppSelector(selectUser);
  const [opened, { open, close }] = useDisclosure(false);
  const idNotification = useRef<string>("");
  const client = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
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
  const { courses, loading } = useFormData();
  const handleUpdateStatus = async (status: string) => {
    idNotification.current = createNotification(isPending);
    await mutateAsync(status);
  };

  const form = useForm({
    initialValues: {
      fullName: "",
      isCame: "",
      reason: "",
      courseId: "",
    } as INewStudentUpdate,
    validate: updateNewStudentValidation,
  });

  useEffect(() => {
    if (student.courseId) {
      form.setFieldValue("courseId", student.courseId);
    }
  }, [student.courseId]);
  console.log(form.values);
  
  return (
    <>
      <Modal opened={opened} onClose={close} size="md">
        <form>
          <Group w="100%" mb={10}>
            <TextInput
              onChange={(event) =>
                form.setFieldValue("fullName", event.target.value)
              }
              error={form.errors.fullName}
              flex={1}
              label="Ismi"
              value={form.values.fullName}
            />
            <Select
              disabled={loading}
              label="Kurs turini tanlang."
              onChange={(event) => form.setFieldValue("courseId", event || "")}
              value={form.values.courseId}
              error={form.errors.courseId}
              data={courses}
            />
          </Group>
          <Select mb={10} label="Holatni tanlash" data={attends} />
          <Textarea
            disabled={form.values.isCame !== "NOT_CAME"}
            onChange={(event) =>
              form.setFieldValue("isCame", event.target.value)
            }
            error={form.errors.reason}
            placeholder="Sababini kiriting..."
            rows={5}
          />
          <Button mt={10} color="green" disabled={isPending}>
            Yangilash
          </Button>
        </form>
      </Modal>
      <Button variant="default" size="compact-md" onClick={open}>
        <Settings size={14} />
      </Button>
    </>
    // <Menu opened={opened} onChange={setOpened} shadow="md">
    //   <Menu.Target>
    //     <Button size="xs" variant="default">
    //       <Ellipsis size="16" />
    //     </Button>
    //   </Menu.Target>
    //   <Menu.Dropdown>
    //     <Menu.Item
    //       onClick={() => handleUpdateStatus("success")}
    //       rightSection={<Check size={14} />}
    //       color="green"
    //     >
    //       Darsga qatnashadigan
    //     </Menu.Item>
    //     <Menu.Item
    //       onClick={() => handleUpdateStatus("reject")}
    //       rightSection={<X size={14} />}
    //       color="red"
    //     >
    //       Darsga qatnashmaydigan
    //     </Menu.Item>
    //     <Menu.Item
    //       onClick={handleDelete}
    //       rightSection={<Trash2 size={14} />}
    //       color="red"
    //     >
    //       Ro'yxatdan o'chirish
    //     </Menu.Item>
    //   </Menu.Dropdown>
    // </Menu>
  );
};
export default OptionsMenuNewStudent;
