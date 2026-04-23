import {
  Button,
  Group,
  Modal,
  Select,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Settings } from "lucide-react";
import { useEffect, useRef } from "react";
import { useAppSelector } from "@/hooks/redux";
import {
  createNotification,
  showErrorNotification,
  showSuccessNotification,
} from "@/utils/notification";
import { Server } from "@/api/api";
import { useDisclosure } from "@mantine/hooks";
import { selectUser } from "@/lib/redux/reducer/admin";
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
  const { courses, loading } = useFormData();
  const form = useForm({
    initialValues: {
      fullName: "",
      isAttend: "",
      reason: "",
      courseId: "",
    } as INewStudentUpdate,
    validate: updateNewStudentValidation,
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (newStudent: INewStudentUpdate) =>
      Server<IMessageResponse>(`newStudents/update/${id}`, {
        method: "PUT",
        headers: {
          authorization: `Bearer ${admin?.token}`,
        },
        body: JSON.stringify(newStudent),
      }),
    mutationKey: ["update", "newStudent", id],
    onSuccess: (success) => {
      client.invalidateQueries({ queryKey: ["newStudents"] });
      showSuccessNotification(idNotification.current, success?.message);
      form.reset();
      close();
    },
    onError: (error) => {
      showErrorNotification(idNotification.current, error.message);
    },
  });
  useEffect(() => {
    if (student) {
      form.setFieldValue("courseId", student.courseId.toString());
      form.setFieldValue("fullName", student.fullName);
      form.setFieldValue("isAttend", student.isAttend);
      form.setFieldValue("reason", student.reason || "");
    }
  }, [student]);
  const handleUpdateStatus = async (newStudent: INewStudentUpdate) => {
    idNotification.current = createNotification(isPending);
    await mutateAsync(newStudent);
  };
  return (
    <>
      <Modal opened={opened} onClose={close} size="md">
        <form onSubmit={form.onSubmit(handleUpdateStatus)}>
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
          <Select
            mb={10}
            label="Holatni tanlash"
            onChange={(event) => form.setFieldValue("isAttend", event || "")}
            value={form.values.isAttend}
            error={form.errors.isAttend}
            data={attends}
          />
          <Textarea
            onChange={(event) =>
              form.setFieldValue("reason", event.target.value)
            }
            value={form.values.reason}
            error={form.errors.reason}
            placeholder="Sababini kiriting..."
            rows={5}
          />
          <Button mt={10} color="green" type="submit" disabled={isPending}>
            Yangilash
          </Button>
        </form>
      </Modal>
      <Button variant="default" size="compact-md" onClick={open}>
        <Settings size={14} />
      </Button>
    </>
  );
};
export default OptionsMenuNewStudent;
