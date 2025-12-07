import {
  Button,
  LoadingOverlay,
  Paper,
  PaperProps,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { InputMask } from "@react-input/mask";
import { useForm } from "@mantine/form";
import { addNewStudentValidation } from "../../validation";
import { useMutation } from "@tanstack/react-query";
import { courseTimes } from "@/config";
import { useRef } from "react";
import {
  createNotification,
  showErrorNotification,
  showSuccessNotification,
} from "@/utils/notification";
import useFormData from "@/hooks/useFormData";
import { Server } from "@/api/api";
const AddNewStudent = (props: PaperProps) => {
  const idNotification = useRef<string>("");
  const form = useForm({
    initialValues: {
      fullName: "",
      phone: "+99 (8",
      courseId: "",
      courseTime: "Muhim emas",
    } as INewStudentCreate,
    validate: addNewStudentValidation,
  });
  const { courses, loading } = useFormData();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (student: INewStudentCreate) =>
      Server<IMessageResponse>(`newStudents/add`, {
        method: "POST",
        body: JSON.stringify(student),
      }),
    mutationKey: ["newStudent"],
    onSuccess: (success) => {
      showSuccessNotification(idNotification.current, success?.message);
      form.reset();
    },
    onError: (error) => {
      showErrorNotification(idNotification.current, error.message);
    },
  });
  const handleSubmit = (student: INewStudentCreate) => {
    idNotification.current = createNotification(isPending);
    mutateAsync(student);
  };
  return (
    <Paper
      className="md:w-[400px] w-full"
      shadow="md"
      radius="md"
      pos="relative"
      p="lg"
      withBorder
      {...props}
    >
      <LoadingOverlay
        visible={isPending}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

      <Text size="lg" py="10" className="text-center" fw={500}>
        IT-Khiva O'quv kurslariga yozilish
      </Text>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            label="Ismingizni kiriting!"
            placeholder="Hikmat "
            value={form.values.fullName}
            size="sm"
            onChange={(event) =>
              form.setFieldValue("fullName", event.target.value.trim())
            }
            error={form.errors.fullName}
            radius="md"
          />
          <InputMask
            mask="+99 (8__) ___-__-__"
            replacement={{ _: /\d/ }}
            autoComplete="off"
            placeholder="+99 (8__) ___-__-__"
            label="Telefon raqamingizni kiriting!"
            component={TextInput}
            error={form.errors.phone && "Raqam kiriting!"}
            value={form.values.phone}
            onChange={(event) => {
              form.setFieldValue("phone", event.target.value);
            }}
          />
          <Select
            disabled={loading}
            label="Kurs turini tanlang."
            onChange={(event) => form.setFieldValue("courseId", event || "")}
            value={form.values.courseId}
            error={form.errors.courseId}
            data={courses}
          />
          <Select
            label="Qaysi vaqt siz uchun qulay."
            value={form.values.courseTime}
            onChange={(event) => form.setFieldValue("courseTime", event || "")}
            error={form.errors.courseTime}
            data={courseTimes}
          />
        </Stack>
        <Button
          disabled={isPending}
          loading={isPending}
          size="sm"
          mt="15"
          color="green"
          type="submit"
          radius="sm"
        >
          Kursga yozilish.
        </Button>
      </form>
    </Paper>
  );
};
export default AddNewStudent;