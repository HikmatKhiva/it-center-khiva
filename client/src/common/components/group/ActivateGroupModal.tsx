import { Server } from "@/api/api";
import { useAppSelector } from "@/hooks/redux";
import { selectUser } from "@/lib/redux/reducer/admin";
import { IGroupActivate, IMessageResponse } from "@/types";
import {
  createNotification,
  showErrorNotification,
  showSuccessNotification,
} from "@/utils/notification";
import { Button, Group, Modal, Text } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
const ActivateGroupModal = ({
  duration,
  id,
  opened,
  close,
}: {
  duration: number;
  id: number;
  opened: boolean;
  close: () => void;
}) => {
  const admin = useAppSelector(selectUser);
  const idNotification = useRef<string>("");
  const client = useQueryClient();
  const currentDate = new Date();
  const form = useForm({
    initialValues: {
      startTime: currentDate,
      finishedDate: new Date(
        new Date().setMonth(new Date().getMonth() + duration),
      ),
    } as IGroupActivate,
    onValuesChange(values) {
      if (values.startTime && duration) {
        const calculated = new Date(values.startTime);
        calculated.setMonth(calculated.getMonth() + duration);
        if (
          !values.finishedDate ||
          calculated.getTime() !== values.finishedDate.getTime()
        ) {
          form.setFieldValue("finishedDate", calculated);
        }
      }
    },
  });
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: IGroupActivate) =>
      Server<IMessageResponse>(`group/activate/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          authorization: `Bearer ${admin?.token}`,
        },
      }),
    mutationKey: ["group", "activate"],
    onSuccess: (success) => {
      showSuccessNotification(idNotification.current, success?.message);
      client.invalidateQueries({ queryKey: ["group", String(id)] });
      close();
    },
    onError: (error) => {
      showErrorNotification(idNotification.current, error.message);
    },
  });
  const handleSubmit = async (data: IGroupActivate) => {
    idNotification.current = createNotification(isPending);
    await mutateAsync(data);
  };
  return (
    <>
      <Modal centered opened={opened} onClose={close}>
        <Text ta="center">Guruh davomiyligi {duration} oy</Text>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Group mt={15} align="flex-end" justify="center">
            <DateInput
              {...form.getInputProps("startTime")}
              label="Boshlanish sana"
            />
            <DateInput
              {...form.getInputProps("finishedDate")}
              label="Tugash sana"
              disabled
            />

            <Button type="submit">Faollashtirish</Button>
          </Group>
        </form>
      </Modal>
    </>
  );
};
export default ActivateGroupModal;