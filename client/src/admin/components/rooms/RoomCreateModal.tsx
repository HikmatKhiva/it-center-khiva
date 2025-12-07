import { Server } from "@/api/api";
import { useAppSelector } from "@/hooks/redux";
import { selectUser } from "@/lib/redux/reducer/admin";
import {
  createNotification,
  showErrorNotification,
  showSuccessNotification,
} from "@/utils/notification";
import { RoomCreateValidate } from "@/validation";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button, NumberInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { Pencil } from "lucide-react";
const RoomCreateModal = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const admin = useAppSelector(selectUser);
  const idNotification = useRef<string>("");
  const client = useQueryClient();
  const form = useForm({
    initialValues: {
      name: "",
      capacity: 0,
    } as IRoomCreate,
    validate: RoomCreateValidate,
  });
  const { isPending, mutateAsync } = useMutation({
    mutationFn: (roomData: IRoomCreate) =>
      Server<IMessageResponse>(`room/create`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${admin?.token}`,
        },
        body: JSON.stringify(roomData),
      }),
    mutationKey: ["room", "create"],
    onSuccess: (success) => { 
      client.invalidateQueries({ queryKey: ["rooms"] });
      showSuccessNotification(idNotification.current, success?.message);
      close();
      form.reset();
    },
    onError: (error) => {
      showErrorNotification(idNotification.current, error.message);
    },
  });

  const handleSubmit = async (data: IRoomCreate) => {
    mutateAsync(data);
    idNotification.current = createNotification(isPending);
  };
  return (
    <>
      <Button
        rightSection={<Pencil size={16} />}
        onClick={open}
        color="green"
        size="sm"
        variant="filled"
      >
        Yaratish.
      </Button>
      <Modal centered opened={opened} onClose={close} title="Xonani Yaratish.">
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
            loading={isPending}
            disabled={isPending}
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

export default RoomCreateModal;
