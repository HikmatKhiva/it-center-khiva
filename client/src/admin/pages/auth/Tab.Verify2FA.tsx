import { Button, PinInput, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { tokenValidation } from "@/validation";
import { useMutation } from "@tanstack/react-query";
import { useRef } from "react";
import {
  createNotification,
  showErrorNotification,
  showSuccessNotification,
} from "@/utils/notification";
import { login } from "@/lib/redux/reducer/admin";
import { useAppDispatch } from "@/hooks/redux";
import { useNavigate } from "react-router-dom";
import { Server } from "@/api/api";
const TabVerify2FA = ({ username }: { username: string }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const idNotification = useRef<string>("");
  const navigateToRole = (role: string) => {
    switch (role) {
      case "ADMIN":
        return navigate("/admin");
      case "TEACHER":
        return navigate("/teacher");
      case "SECRETARY":
        return navigate("/secretary");
      default:
        return null;
    }
  };
  const form = useForm({
    initialValues: {
      username,
      token: "",
    } as I2FAData,
    validate: tokenValidation,
  });
  const { isPending, mutateAsync } = useMutation({
    mutationFn: (data: I2FAData) =>
      Server<I2FAResponse>("auth/admin/verify-2fa", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    mutationKey: ["user", "verify"],
    onSuccess: (success) => {
      showSuccessNotification(idNotification.current, success?.message);
      navigateToRole(success?.user?.role);
      dispatch(login(success.user));
    },
    onError: (error) => {
      showErrorNotification(idNotification.current, error.message);
    },
  });
  const handleSubmit2FA = async (data: I2FAData) => {
    idNotification.current = createNotification(isPending);
    await mutateAsync(data);
  };
  return (
    <form onSubmit={form.onSubmit(handleSubmit2FA)}>
      <Stack justify="center" pb="10">
        <Text fz={{ sm: "md", md: "xl" }} ta="center">
          Authenticator codeni kiriting.
        </Text>
        <PinInput
          color="green"
          type="number"
          error={!!form.errors.token}
          oneTimeCode
          onChange={(value) => {
            form.setFieldValue("token", value);
          }}
          length={6}
          m="0 auto"
        />
        <Button
          loading={isPending}
          aria-label="login admin page"
          aria-labelledby="login button"
          size="sm"
          disabled={!!form.errors.token || isPending}
          m="15px auto 10px"
          color="green"
          type="submit"
          radius="md"
        >
          Tasdiqlash
        </Button>
      </Stack>
    </form>
  );
};
export default TabVerify2FA;
