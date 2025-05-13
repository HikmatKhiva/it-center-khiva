import {
  Button,
  LoadingOverlay,
  Paper,
  PaperProps,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { anonymMessageValidation } from "@/validation";
import { useMutation } from "@tanstack/react-query";
import { useRef } from "react";
import {
  createNotification,
  showErrorNotification,
  showSuccessNotification,
} from "@/utils/notification";
import { Server } from "@/api/api";
const AnonymMessage = (props: PaperProps) => {
  const idNotification = useRef<string>("");
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: IAnonymMessage) =>
      Server<IMessageResponse>(`message/create`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    mutationKey: ["anonym", "message"],
    onSuccess: (success) => {
      showSuccessNotification(idNotification.current, success?.message);
      form.reset();
    },
    onError: (error) => {
      showErrorNotification(idNotification.current, error.message);
    },
  });
  const form = useForm({
    initialValues: {
      fullName: "",
      message: "",
    } as IAnonymMessage,
    validate: anonymMessageValidation,
  });
  const handleSubmit = (student: IAnonymMessage) => {
    idNotification.current = createNotification(isPending);
    mutateAsync(student);
  };
  return (
    <Paper
      className="md:w-[400px] w-full"
      shadow="md"
      radius="md"
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
        Shikoyat yoki taklif qoldiring.
      </Text>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            label="Ismini kiriting!"
            placeholder="Hikmat Front End ustoz"
            value={form.values.fullName}
            size="sm"
            onChange={(event) =>
              form.setFieldValue("fullName", event.currentTarget.value.trim())
            }
            error={form.errors.fullName}
            radius="md"
          />
          <Textarea
            value={form.values.message}
            onChange={(event) =>
              form.setFieldValue("message", event.currentTarget.value.trim())
            }
            error={form.errors.message}
            label="Xabaringizni yozing!"
            size="sm"
            placeholder="Xabarini kiriting..."
            rows={5}
          />
        </Stack>
        <Button
          disabled={isPending}
          loading={isPending}
          size="sm"
          fz="sm"
          mt="15"
          color="green"
          type="submit"
          radius="sm"
        >
          Xabarni yuborish
        </Button>
      </form>
    </Paper>
  );
};
export default AnonymMessage;
