import { RoomCreateValidate } from "@/validation";
import { Button, Modal, NumberInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { Pen } from "lucide-react";
import React from "react";

const RoomUpdateModal = () => {
  const form = useForm({
    initialValues: {
      name: "",
      capacity: 0,
    } as IRoom,
    validate: RoomCreateValidate,
  });
  const handleSubmit = async () => {};
  const [opened, { open, close }] = useDisclosure(false);
console.log(form.errors.capacity);

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
