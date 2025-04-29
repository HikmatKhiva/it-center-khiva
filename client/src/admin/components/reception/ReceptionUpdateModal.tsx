import { Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Pen } from "lucide-react";
import ProfileUpdate from "../../../common/components/profile/ProfileUpdate";
const ReceptionUpdateModal = ({ profile }: { profile: IUserProfile }) => {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <Button
        onClick={open}
        rightSection={<Pen size={16} />}
        color="green"
        size="xs"
        variant="outline"
      >
        O'zgartirish.
      </Button>
      <Modal opened={opened} onClose={close}>
        <ProfileUpdate profile={profile} />
      </Modal>
    </>
  );
};
export default ReceptionUpdateModal;
