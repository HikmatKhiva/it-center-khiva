import { Server } from "@/api/api";
import { useAppSelector } from "@/hooks/redux";
import { selectUser } from "@/lib/redux/reducer/admin";
import {
  createNotification,
  showErrorNotification,
  showSuccessNotification,
} from "@/utils/notification";
import { Switch } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, X } from "lucide-react";
import { useRef } from "react";
const ReceptionStatusUpdate = ({ profile }: { profile: IUserProfile }) => {
  const admin = useAppSelector(selectUser);
  const idNotification = useRef<string>("");
  const client = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (value: { username: string; isActive: boolean }) =>
      Server<IMessageResponse>(`reception/status`, {
        method: "PATCH",
        body: JSON.stringify(value),
        headers: {
          authorization: `Bearer ${admin?.token}`,
        },
      }),
    mutationKey: ["reception", "status", "update"],
    onSuccess: (success) => {
      showSuccessNotification(idNotification.current, success?.message);
      client.invalidateQueries({ queryKey: ["receptions"] });
    },
    onError: (error) => {
      showErrorNotification(idNotification.current, error.message);
    },
  });
  const handleUpdateStatus = async (profile: IUserProfile) => {
    await mutateAsync({
      username: profile.username,
      isActive: !profile.isActive,
    });
    idNotification.current = createNotification(isPending);
  };
  return (
    <>
      <Switch
        disabled={isPending}
        checked={profile.isActive}
        onChange={() => handleUpdateStatus(profile)}
        thumbIcon={
          profile.isActive ? (
            <Check size={12} color="var(--mantine-color-teal-6)" />
          ) : (
            <X size={12} color="var(--mantine-color-red-6)" />
          )
        }
      />
    </>
  );
};
export default ReceptionStatusUpdate;