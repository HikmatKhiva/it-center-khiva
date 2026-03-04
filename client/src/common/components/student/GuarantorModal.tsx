import { IGuarantor } from "@/types";
import { Button, Grid, Group, Modal, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { UserRound } from "lucide-react";
const GuarantorModal = ({
  guarantor,
  fullName,
}: {
  guarantor: IGuarantor;
  fullName: string;
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <Button
        disabled={!guarantor}
        onClick={open}
        color="green"
        size="xs"
        variant="outline"
      >
        <UserRound size="18" />
      </Button>
      <Modal opened={opened} onClose={close} title={fullName}>
        <Grid justify="center">
          <Grid.Col span={6}>
            <TextInput
              value={guarantor?.firstName}
              placeholder="Ism"
              label="Ism"
              readOnly
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              value={guarantor?.secondName}
              placeholder="Familiyasi"
              label="Familiyasi"
              readOnly
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              value={guarantor?.passportId}
              placeholder="FA 123456"
              label="Passport"
              readOnly
            />
          </Grid.Col>
          <Grid.Col span={6}>
            <TextInput
              value={guarantor?.phone}
              placeholder="+998 9* *** ** **"
              label="Telefon raqami"
              readOnly
            />
          </Grid.Col>
        </Grid>
      </Modal>
    </>
  );
};
export default GuarantorModal;
