import { Button, Modal, Stack, TextInput, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCourseValidation } from "@/validation";
import { useAppSelector } from "@/hooks/redux";
import { selectUser } from "@/lib/redux/reducer/admin";
import {
  createNotification,
  showErrorNotification,
  showSuccessNotification,
} from "@/utils/notification";
import { useRef } from "react";
import useFormData from "@/hooks/useFormData";
import { Server } from "@/api/api";
import { Pencil } from "lucide-react";
const CreateCourseModal = () => {
  const admin = useAppSelector(selectUser);
  const idNotification = useRef<string>("");
  const [opened, { open, close }] = useDisclosure(false);
  const { teachers, loading } = useFormData();
  const client = useQueryClient();
  const form = useForm({
    initialValues: {
      name: "",
      teacherId: "",
      nameCertificate: "",
    } as INewCourse,
    validate: createCourseValidation,
  });
  const { isPending, mutateAsync } = useMutation({
    mutationFn: (course: INewCourse) =>
      Server<IMessageResponse>(`course/create`, {
        method: "POST",
        body: JSON.stringify(course),
        headers: {
          authorization: `Bearer ${admin?.token || ""}`,
        },
      }),
    onSuccess: (success) => {
      client.invalidateQueries({ queryKey: ["courses"] });
      showSuccessNotification(idNotification.current, success?.message);
      close();
      form.reset();
    },
    onError: (error) => {
      showErrorNotification(idNotification.current, error.message);
    },
  });
  const handleSubmit = async (course: INewCourse) => {
    idNotification.current = createNotification(isPending);
    mutateAsync(course);
  };
  return (
    <>
      <Button
        onClick={open}
        rightSection={<Pencil size="16" />}
        color="green"
        type="button"
        variant="filled"
      >
        Kurs Yaratish
      </Button>
      <Modal opened={opened} onClose={close}>
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
              radius="sm"
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
            Yaratish
          </Button>
        </form>
      </Modal>
    </>
  );
};
export default CreateCourseModal;