import { IGuarantor } from "@/types";
import { Button, Modal, Table } from "@mantine/core";
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
      <Modal
        size="lg"
        opened={opened}
        onClose={close}
        title={`O'quvchi: ${fullName}`}
      >
        <Table striped>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Ism</Table.Th>
              <Table.Th>Familiya</Table.Th>
              <Table.Th>Telefon</Table.Th>
              <Table.Th>Passport Id</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr key={guarantor?.id}>
              <Table.Td>{guarantor?.firstName}</Table.Td>
              <Table.Td>{guarantor?.secondName}</Table.Td>
              <Table.Td>{guarantor?.phone}</Table.Td>
              <Table.Td>{guarantor?.passportId}</Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
        {/* <Grid justify="center">
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
        </Grid> */}
      </Modal>
    </>
  );
};
export default GuarantorModal;