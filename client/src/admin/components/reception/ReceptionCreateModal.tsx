import { Server } from "@/api/api";
import { useAppSelector } from "@/hooks/redux";
import { selectUser } from "@/lib/redux/reducer/admin";
import {
  createNotification,
  showErrorNotification,
  showSuccessNotification,
} from "@/utils/notification";
import { adminValidate } from "@/validation";
import {
  ActionIcon,
  Button,
  Group,
  Modal,
  PasswordInput,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, RefreshCw, SquareAsterisk } from "lucide-react";
import { useRef, useState } from "react";
const ReceptionCreateModal = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [updateSecret, setUpdateSecret] = useState<boolean>(false);
  const idNotification = useRef<string>("");
  const admin = useAppSelector(selectUser);
  const client = useQueryClient();
  const form = useForm({
    initialValues: {
      username: "",
      password: "",
      secret: "",
      role: "RECEPTION",
    } as IUserRegister,
    validate: adminValidate,
  });
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: IUserRegister) =>
      Server<IMessageResponse>(`reception/register`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          authorization: `Bearer ${admin?.token}`,
        },
      }),
    mutationKey: ["reception", "profile", "create"],
    onSuccess: (success) => {
      client.invalidateQueries({ queryKey: ["receptions"] });
      showSuccessNotification(idNotification.current, success?.message);
      close();
      form.reset();
    },
    onError: (error) => {
      showErrorNotification(idNotification.current, error.message);
    },
  });
  const handleSubmit = async (data: IUserRegister) => {
    idNotification.current = createNotification(isPending);
    await mutateAsync(data);
  };
  const handleUpdateSecretKey = async () => {
    const response = await Server<string>(`generate-secret`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${admin?.token}`,
      },
    });
    form.setFieldValue("secret", response);
    setUpdateSecret(!updateSecret);
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
        Hisob Yaratish.
      </Button>
      <Modal opened={opened} onClose={close}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Username"
              placeholder="User"
              size="sm"
              value={form.values.username}
              onChange={(event) =>
                form.setFieldValue("username", event.target.value)
              }
              error={form.errors.username}
              radius="sm"
            />
            <PasswordInput
              label="Password"
              value={form.values.password}
              onChange={(event) =>
                form.setFieldValue("password", event.target.value)
              }
              error={form.errors.password}
              placeholder="*****"
            />
            <TextInput
              value={form.values.secret}
              readOnly
              disabled={updateSecret}
              label="Secret key"
              onChange={(event) =>
                form.setFieldValue("secret", event.target.value)
              }
              error={form.errors.secret}
              leftSection={<SquareAsterisk />}
              rightSection={
                <Group>
                  <ActionIcon
                    disabled={updateSecret}
                    onClick={handleUpdateSecretKey}
                  >
                    <RefreshCw size="16" />
                  </ActionIcon>
                </Group>
              }
            />
          </Stack>
          <Button
            loading={isPending}
            disabled={
              !!form.errors.username ||
              !!form.errors.password ||
              !!form.errors.secret
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
export default ReceptionCreateModal;