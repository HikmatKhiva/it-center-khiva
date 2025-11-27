import { Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import RoomCreateForm from "./RoomCreateForm";
const RoomCreateModal = () => {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <Button onClick={open} color="green" size="sm" variant="filled">
        Yaratish.
      </Button>
      <Modal
        centered
        opened={opened}
        onClose={close}
        title="Xonani Yaratish.">
        <RoomCreateForm />
      </Modal>
    </>
  );
};

export default RoomCreateModal;
