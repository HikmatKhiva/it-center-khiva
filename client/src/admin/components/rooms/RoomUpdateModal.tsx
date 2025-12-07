import { Server } from "@/api/api";
import { useAppSelector } from "@/hooks/redux";
import { selectUser } from "@/lib/redux/reducer/admin";
import {
  createNotification,
  showErrorNotification,
  showSuccessNotification,
} from "@/utils/notification";
import { RoomCreateValidate } from "@/validation";
import { Button, Modal, NumberInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pen } from "lucide-react";
import { useEffect, useRef } from "react";
const RoomUpdateModal = ({ id }: { id: number }) => {
  const admin = useAppSelector(selectUser);
  const client = useQueryClient();
  const idNotification = useRef<string>("");
  const [opened, { open, close }] = useDisclosure(false);
  const form = useForm({
    initialValues: {
      name: "",
      capacity: 0,
    } as IRoomForm,
    validate: RoomCreateValidate,
  });
  const { data } = useQuery<RoomQueryResponse>({
    queryKey: ["room", id],
    queryFn: () =>
      Server<RoomQueryResponse>(`room/${id}`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${admin?.token}`,
        },
      }),
    enabled: !!admin?.token && !!id,
  });
  useEffect(() => {
    if (data?.room) {
      form.setValues({
        name: data?.room.name || "",
        capacity: data.room.capacity || 0,
      });
    }
  }, [data?.room]);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: IRoomForm) =>
      Server<IMessageResponse>(`room/update/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          authorization: `Bearer ${admin?.token}`,
        },
      }),
    onSuccess: (success) => {
      client.invalidateQueries({ queryKey: ["rooms"] });
      showSuccessNotification(idNotification.current, success?.message);
      close();
    },
    onError: (error) => {
      showErrorNotification(idNotification.current, error.message);
    },
  });

  const handleSubmit = async (data: IRoomForm) => {
    idNotification.current = createNotification(isPending);
    mutateAsync(data);
  };
  return (
    <>
      <Button onClick={open} size="xs" rightSection={<Pen size={16} />}>
        O'zgartirish
      </Button>
      <Modal opened={opened} onClose={close}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Xona nomini kiriting."
            placeholder="1.1"
            size="sm"
            value={form.values.name}
            onChange={(event) => form.setFieldValue("name", event.target.value)}
            error={form.errors.name}
            radius="md"
          />
          <NumberInput
            label="O'quvchi sig'imini kiriting."
            placeholder="15"
            size="sm"
            value={form.values.name}
            min={5}
            max={30}
            {...form.getInputProps("capacity")}
            error={form.errors.capacity}
            radius="md"
          />
          <Button
            // loading={isPending}
            // disabled={isPending}
            size="sm"
            mt="15"
            color="green"
            type="submit"
            radius="md"
          >
            Yaratish.
          </Button>
        </form>
      </Modal>
    </>
  );
};

export default RoomUpdateModal;
