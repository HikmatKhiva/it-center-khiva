import {
  ActionIcon,
  Avatar,
  Button,
  FileButton,
  Group,
  Modal,
  PasswordInput,
  Stack,
  TextInput,
} from "@mantine/core";
import {
  Check,
  RefreshCw,
  Save,
  SquareAsterisk,
  UserRound,
  X,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { useForm } from "@mantine/form";
import { adminValidate } from "@/validation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { login, selectUser } from "@/lib/redux/reducer/admin";
import {
  createNotification,
  showErrorNotification,
  showSuccessNotification,
} from "@/utils/notification";
import { Server } from "@/api/api";
import {
  I2FAResponse,
  IMessageResponse,
  IUserProfile,
  IUserUpdate,
} from "@/types";
import ProfilePhotoDelete from "./ProfilePhotoDelete";
const ProfileUpdate = ({
  profile,
  opened,
  close,
}: {
  profile: IUserProfile | undefined;
  opened: boolean;
  close: () => void;
}) => {
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
      close()
    },
    onError: (error) => {
      showErrorNotification(idNotification.current, error.message);
    },
  });
  const form = useForm({
    initialValues: {
      id: 0,
      username: "",
      secret: "",
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
  const [file, setFile] = useState<File | null>();
  const { mutateAsync: mutateAsyncPhoto, isPending: isPendingPhoto } =
    useMutation({
      mutationFn: (data: FormData) =>
        Server<IMessageResponse>(`admin/upload-image`, {
          method: "POST",
          headers: {
            authorization: `Bearer ${admin?.token || ""}`,
          },
          data: data,
        }),
      onSuccess: (success) => {
        showSuccessNotification(idNotification.current, success?.message);
        client.invalidateQueries({ queryKey: ["profile"] });
        setFile(null);
      },
      onError: (error) => {
        showErrorNotification(idNotification.current, error.message);
      },
    });
  const clearFile = () => setFile(null);
  const handleSaveImage = async () => {
    idNotification.current = createNotification(isPending);
    if (file) {
      const form = new FormData();
      form.append("image", file);
      mutateAsyncPhoto(form);
    }
  };
  useEffect(() => {
    if (profile) {
      form.setFieldValue("id", profile?.id);
      form.setFieldValue("username", profile?.username);
      form.setFieldValue("secret", profile?.secret);
    }
  }, [profile]);
  return (
    <Modal opened={opened} onClose={close}>
      <Group justify="center">
        <Stack gap="5" justify="center" align="center" mb={10}>
          <FileButton onChange={setFile} accept="image/png,image/jpeg">
            {(props) => (
              <Avatar
                {...props}
                size={60}
                className="shadow"
                src={file ? URL.createObjectURL(file) : profile?.photo_url}
                alt={profile?.username}
              >
                {profile?.username.charAt(0).toUpperCase()}
              </Avatar>
            )}
          </FileButton>
          <ProfilePhotoDelete photo={profile?.photo_url ?? null} />
        </Stack>
      </Group>
      <Group hidden={!file} justify="center" gap="1" mb="10">
        <Button
          onClick={handleSaveImage}
          disabled={isPendingPhoto}
          loading={isPendingPhoto}
          size="xs"
          color="green"
          variant="outline"
        >
          <Check size="16" />
        </Button>
        <Button
          disabled={isPendingPhoto}
          onClick={clearFile}
          size="xs"
          color="red"
          variant="outline"
        >
          <X size="16" />
        </Button>
      </Group>
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
  );
};
export default ProfileUpdate;