import { Button, Stack, TextInput } from "@mantine/core";
import { Check, Mail, Save, UserRound, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { useForm } from "@mantine/form";
import { adminValidate } from "../../../validation";
import { useMutation } from "@tanstack/react-query";
import { updateAdminProfile } from "../../api/api.admin";
import { MutableRefObject, useRef } from "react";
import { notifications } from "@mantine/notifications";
import { updateProfile } from "../../../lib/redux/reducer/admin";
const AdminProfileUpdate = () => {
  const { admin } = useAppSelector((state) => state.admin);
  const idNotification: MutableRefObject<string | undefined> = useRef();
  const dispatch = useAppDispatch();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: IAdminProfile) =>
      updateAdminProfile(data, admin?.token || ""),
    mutationKey: ["admin", "profile", "update"],
    onSuccess: (response) => {
      notifications.update({
        id: idNotification.current,
        title: "Ma'lumotlar saqlandi.",
        message: response?.message,
        color: "white",
        autoClose: 3000,
        position: "top-right",
        icon: <Check color="#93CE03" />,
      });
      dispatch(updateProfile(response.admin));
    },
    onError: (error) => {
      notifications.update({
        id: idNotification.current,
        title: "Ma'lumotlar yangilanishda xato bo'ldi.",
        message: error?.message,
        color: "red",
        autoClose: 3000,
        position: "top-right",
        icon: <X color="white" />,
      });
    },
  });
  const form = useForm({
    initialValues: {
      email: admin?.email || "",
      username: admin?.username || "",
    } as IAdminProfile,
    validate: adminValidate,
  });
  const handleSubmit = async (data: IAdminProfile) => {
    idNotification.current = notifications.show({
      loading: isPending,
      title: "Ma'lumotlar yangilanyapti.",
      message: "Iltimos ma'lumotlar yangilanguncha kutib turing!",
      color: "blue",
      position: "top-right",
      withCloseButton: true,
    });
    await mutateAsync(data);
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
          value={form.values.email}
          onChange={(event) => form.setFieldValue("email", event.target.value)}
          error={form.errors.email}
          label="Email ni yangilash"
          leftSection={<Mail />}
        />
      </Stack>
      <Button
        disabled={isPending}
        loading={isPending}
        mt="20"
        type="submit"
        rightSection={<Save />}
      >
        Yangilash
      </Button>
    </form>
  );
};
export default AdminProfileUpdate;