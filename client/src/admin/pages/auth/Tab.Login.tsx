import { Button, PasswordInput, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { adminValidation } from "@/validation";
import { useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  createNotification,
  showErrorNotification,
  showSuccessNotification,
} from "@/utils/notification";
import { Server } from "@/api/api";
const TabLogin = ({
  nextStep,
  handleLogin,
}: {
  nextStep: () => void;
  handleLogin: (username: string) => void;
}) => {
  const idNotification = useRef<string>("");
  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    } as IUserLogin,
    validate: adminValidation,
  });
  const { isPending, mutateAsync } = useMutation({
    mutationFn: (user: IUserLogin) =>
      Server<ILoginResponse>("auth/admin/login", {
        method: "POST",
        body: JSON.stringify(user),
      }),
    mutationKey: ["user", "login"],
    onSuccess: (success) => {
      showSuccessNotification(idNotification.current, success?.message);
      handleLogin(success?.username);
      nextStep();
    },
    onError: (error) => {
      showErrorNotification(idNotification.current, error.message);
    },
  });
  const handleSubmit = async (user: IUserLogin): Promise<void> => {
    idNotification.current = createNotification(isPending);
    await mutateAsync(user);
  };
  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <TextInput
          label="Username"
          placeholder="admin_it-khiva.uz"
          value={form.values.username}
          size="md"
          onChange={(event) =>
            form.setFieldValue("username", event.target.value)
          }
          error={form.errors.username}
          radius="md"
        />
        <PasswordInput
          size="md"
          label="Password"
          placeholder="Your password"
          value={form.values.password}
          onChange={(event) =>
            form.setFieldValue("password", event.target.value)
          }
          error={form.errors.password}
          radius="md"
        />
      </Stack>
      <Button
        loading={isPending}
        disabled={isPending}
        size="md"
        mt="15"
        color="green"
        type="submit"
        radius="md"
      >
        Kirish
      </Button>
    </form>
  );
};
export default TabLogin;
