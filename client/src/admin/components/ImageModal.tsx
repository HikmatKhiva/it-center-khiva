import { Avatar, Modal, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
const ImageModal = ({
  photo,
  firstName,
}: {
  photo: string;
  firstName: string;
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <Avatar className="shadow" onClick={open} size="40" src={photo}>
        {firstName[0]?.toUpperCase()}
      </Avatar>
      <Modal size="lg" opened={opened} onClose={close}>
        <Stack justify="center" align="center" mb="20" gap="5px">
          <Avatar size="xl" w="120" h="120" src={photo} alt="teacher photo">
            {firstName[0]?.toUpperCase()}
          </Avatar>
          <Text className="capitalize">{firstName}</Text>
        </Stack>
      </Modal>
    </>
  );
};
export default ImageModal;