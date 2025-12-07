import {
  ActionIcon,
  Button,
  Group,
  PasswordInput,
  Stack,
  TextInput,
} from "@mantine/core";
import { RefreshCw, Save, SquareAsterisk, UserRound } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useForm } from "@mantine/form";
import { adminValidate } from "@/validation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { login, selectUser } from "@/lib/redux/reducer/admin";
import {
  createNotification,
  showErrorNotification,
  showSuccessNotification,
} from "@/utils/notification";
import { Server } from "@/api/api";
const ProfileUpdate = ({ profile }: { profile: IUserProfile | undefined }) => {
  const admin = useAppSelector(selectUser);
  const idNotification = useRef<string>("");
  const dispatch = useAppDispatch();
  const client = useQueryClient();
  const [updateSecret, setUpdateSecret] = useState<boolean>(false);
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: IUserUpdate) =>
      Server<I2FAResponse>("admin/profile/update", {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          authorization: `Bearer ${admin?.token}`,
        },
      }),
    mutationKey: ["admin", "profile", "update"],
    onSuccess: (success) => {
      showSuccessNotification(idNotification.current, success?.message);
      dispatch(login(success.user));
      client.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error) => {
      showErrorNotification(idNotification.current, error.message);
    },
  });
  const form = useForm({
    initialValues: {
      id: profile?.id || 0,
      username: profile?.username || "",
      secret: profile?.secret,
      password: "",
    } as IUserUpdate,
    validate: adminValidate,
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
          label="Secret key ni yangilash"
          onChange={(event) => form.setFieldValue("secret", event.target.value)}
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
  );
};
export default ProfileUpdate;
