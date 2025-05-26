import { useDisclosure } from "@mantine/hooks";
import { Button, Modal, Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCourseValidation } from "@/validation";
import { useAppSelector } from "@/hooks/redux";
import { selectUser } from "@/lib/redux/reducer/admin";
import { Pen } from "lucide-react";
import { useEffect, useRef } from "react";
import {
  createNotification,
  showErrorNotification,
  showSuccessNotification,
} from "@/utils/notification";
import useFormData from "@/hooks/useFormData";
import { Server } from "@/api/api";
const UpdatedCourseModal = ({ id }: { id: number }) => {
  const client = useQueryClient();
  const admin = useAppSelector(selectUser);
  const idNotification = useRef<string>("");
  const { teachers, loading } = useFormData();
  const [opened, { open, close }] = useDisclosure(false);
  const { data } = useQuery<ICourseResponse>({
    queryKey: ["course", id],
    queryFn: () =>
      Server<ICourseResponse>(`course/${id}`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${admin?.token}`,
        },
      }),
    enabled: !!admin?.token && !!id,
  });
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: INewCourse) =>
      Server<IMessageResponse>(`course/update/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          authorization: `Bearer ${admin?.token}`,
        },
      }),
    onSuccess: (success) => {
      client.invalidateQueries({ queryKey: ["courses"] });
      showSuccessNotification(idNotification.current, success?.message);
      close();
    },
    onError: (error) => {
      showErrorNotification(idNotification.current, error.message);
    },
  });
  const form = useForm({
    initialValues: {
      name: "",
      teacherId: "",
      nameCertificate: "",
    } as INewCourse,
    validate: createCourseValidation,
  });
  useEffect(() => {
    if (data) {
      form.setValues({
        name: data?.name || "",
        teacherId: data?.teacherId?.toString() || "",
        nameCertificate: data?.nameCertificate || "",
      });
    }
  }, [data]);
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