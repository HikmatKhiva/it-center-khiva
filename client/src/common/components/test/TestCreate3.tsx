import { useDisclosure } from "@mantine/hooks";
import { Drawer, Button } from "@mantine/core";
const TestCreate3 = () => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Drawer position="right" opened={opened} onClose={close} title="Authentication">
        {/* Drawer content */}
      </Drawer>

      <Button variant="default" onClick={open}>
        Open Drawer
      </Button>
    </>
  );
};

export default TestCreate3;
