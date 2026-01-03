import { Button, Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { MessageCircle } from "lucide-react";
const MessageModal = ({
  message,
  fullName,
}: {
  message: string;
  fullName: string;
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <Modal opened={opened} onClose={close} title={fullName}>
        <Text>{message}</Text>
      </Modal>

      <Button size="compact-sm" variant="filled" color="green" onClick={open}>
        <MessageCircle size={16} />
      </Button>
    </>
  );
};
export default MessageModal;