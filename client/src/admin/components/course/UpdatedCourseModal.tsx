import { useDisclosure } from "@mantine/hooks";
import { Button, Modal, Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCourseValidation } from "@/validation";
import { useAppSelector } from "@/hooks/redux";
import { selectUser } from "@/lib/redux/reducer/admin";
import { Pen } from "lucide-react";
import { useRef } from "react";
import {
  createNotification,
  showErrorNotification,
  showSuccessNotification,
} from "@/utils/notification";
import useFormData from "@/hooks/useFormData";
import { Server } from "@/api/api";
const UpdatedCourseModal = ({ course }: { course: ICourse }) => {
  const client = useQueryClient();
  const admin = useAppSelector(selectUser);
  const idNotification = useRef<string>("");
  const { teachers, loading } = useFormData();
  const [opened, { open, close }] = useDisclosure(false);
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: INewCourse) =>
      Server<IMessageResponse>(`course/update/${course.id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          authorization: `Bearer ${admin?.token || ""}`,
        },
      }),
    onSuccess: (success) => {
      client.invalidateQueries({ queryKey: ["courses", course.id] });
      showSuccessNotification(idNotification.current, success?.message);
      close();
    },
    onError: (error) => {
      showErrorNotification(idNotification.current, error.message);
    },
  });
  const form = useForm({
    initialValues: {
      name: course?.name,
      teacherId: course.teacher.id.toString(),
      nameCertificate: course.nameCertificate,
    } as INewCourse,
    validate: createCourseValidation,
  });
  const handleSubmit = async (course: INewCourse) => {
    idNotification.current = createNotification(isPending);
    mutateAsync(course);
  };
  return (
    <>
      <Button
        onClick={open}
        rightSection={<Pen size={16} />}
        color="green"
        size="xs"
        variant="outline"
      >
        O'zgartirish.
      </Button>
      <Modal opened={opened} onClose={close} title="Kursni o'zgartirish">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Kurs nomini kiriting"
              placeholder="Dasturlash"
              size="sm"
              value={form.values.name}
              onChange={(event) =>
                form.setFieldValue("name", event.target.value)
              }
              error={form.errors.name}
              radius="md"
            />
            <TextInput
              label="Kurs sertificate uchun nom"
              placeholder="Front-End programming"
              size="sm"
              value={form.values.nameCertificate}
              onChange={(event) =>
                form.setFieldValue("nameCertificate", event.target.value)
              }
              error={form.errors.nameCertificate}
              radius="sm"
            />
            <Select
              disabled={loading}
              label="O'qituvchini tanlang..."
              placeholder="O''qituvchini tanlang..."
              {...form.getInputProps("teacherId")}
              data={teachers}
            />
          </Stack>
          <Button
            loading={isPending}
            disabled={
              loading ||
              !!form.errors.name ||
              !!form.errors.nameCertificate ||
              !!form.errors.teacherId
            }
            size="sm"
            mt="15"
            color="green"
            type="submit"
            radius="sm"
          >
            Yangilash.
          </Button>
        </form>
      </Modal>
    </>
  );
};
export default UpdatedCourseModal;