import {
  ActionIcon,
  Button,
  Group,
  Modal,
  PasswordInput,
  Stack,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Pen, RefreshCw, Save, SquareAsterisk, UserRound } from "lucide-react";
import {
  createNotification,
  showErrorNotification,
  showSuccessNotification,
} from "@/utils/notification";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "@/hooks/redux";
import { selectUser } from "@/lib/redux/reducer/admin";
import { Server } from "@/api/api";
import { useForm } from "@mantine/form";
import { adminValidate } from "@/validation";
import { I2FAResponse, IUserProfile, IUserUpdate } from "@/types";
const ReceptionUpdateModal = ({ id }: { id: number }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const admin = useAppSelector(selectUser);
  const idNotification = useRef<string>("");
  const client = useQueryClient();
  const [updateSecret, setUpdateSecret] = useState<boolean>(false);
  const form = useForm({
    initialValues: {
      username: "",
      secret: "",
      password: "",
    } as IUserUpdate,
    validate: adminValidate,
  });
  const { data } = useQuery({
    queryKey: ["reception", "profile"],
    queryFn: () =>
      Server<IUserProfile>(`reception/${id}`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${admin?.token}`,
        },
      }),
    enabled: !!admin?.token && !!id && opened,
  });
  useEffect(() => {
    if (data) {
      form.setValues({
        username: data.username,
        secret: data.secret,
      });
    }
  }, [data]);
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: IUserUpdate) =>
      Server<I2FAResponse>(`reception/update/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          authorization: `Bearer ${admin?.token}`,
        },
      }),
    mutationKey: ["reception", "profile", "update"],
    onSuccess: (success) => {
      showSuccessNotification(idNotification.current, success?.message);
      client.invalidateQueries({ queryKey: ["receptions"] });
      close();
      form.reset();
    },
    onError: (error) => {
      showErrorNotification(idNotification.current, error.message);
    },
  });
  const handleSubmit = async (data: IUserUpdate) => {
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
        rightSection={<Pen size={16} />}
        color="green"
        size="xs"
        variant="outline"
      >
        O'zgartirish.
      </Button>
      <Modal opened={opened} onClose={close}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="xs">
            <TextInput
              value={form.values.username}
              label="Ism ni yangilash"
              onChange={(event) =>
                form.setFieldValue("username", event.target.value)
              }
              error={form.errors.username}
              leftSection={<UserRound />}
            />
            <TextInput
              value={form.values.secret}
              readOnly
              disabled={updateSecret}
              label="Secret key ni yangilash."
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
            <PasswordInput
              size="sm"
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
            disabled={isPending}
            loading={isPending}
            mt="20"
            type="submit"
            rightSection={<Save />}
          >
            Yangilash.
          </Button>
        </form>
      </Modal>
    </>
  );
};
export default ReceptionUpdateModal;
