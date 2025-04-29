import { Button, Modal, Select } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { CalendarPlus } from "lucide-react";
import { weeks } from "@/config";

const AdminRoomTimeCreateModal = () => {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <Button
        onClick={open}
        rightSection={<CalendarPlus size="16" />}
        size="sm"
      >
        Vaqt qo'shish
      </Button>
      <Modal opened={opened} onClose={close}>
        <form>
          <Select data={weeks}/>
        </form>
      </Modal>
    </>
  );
};

export default AdminRoomTimeCreateModal;
