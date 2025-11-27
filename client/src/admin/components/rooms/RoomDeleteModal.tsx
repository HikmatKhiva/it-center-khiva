import { Button, Group, Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Trash } from "lucide-react";
import React from "react";
const RoomDeleteModal = () => {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <Button
        onClick={open}
        rightSection={<Trash size="16" />}
        color="red"
        size="xs"
        variant="outline"
      >
        O'chirish
      </Button>
      <Modal
        centered
        opened={opened}
        onClose={close}
        title="Xonani o'chirish."
      >
        <Text size="md" className="text-center">
          Siz ushbu Xonani o'chirishni xohlaysizmi?
        </Text>
        <Group mt={20} justify="end" gap="10">
          <Button
            // loading={isPending}
            // disabled={isPending}
            type="button"
            color="green"
            // onClick={handleClick}
          >
            Ha
          </Button>
          <Button
            type="button"
            // disabled={isPending}
            color="red"
            variant="outline"
            onClick={close}
          >
            Yo'q
          </Button>
        </Group>
      </Modal>
    </>
  );
};

export default RoomDeleteModal;
