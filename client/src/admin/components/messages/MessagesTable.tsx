// import { IMessage } from "@/types";
import { formatTime } from "@/utils/helper";
import { Table } from "@mantine/core";
import MessageModal from "./MessageModal";
import MessageDeleteModal from "./MessageDeleteModal";
const MessagesTable = ({ messages }: { messages: IMessage[] }) => {
  const rows = messages.map((message: IMessage, index: number) => (
    <Table.Tr key={message.id}>
      <Table.Td>{index + 1}</Table.Td>
      <Table.Td>{message.fullName}</Table.Td>
      <Table.Td>
        <MessageModal fullName={message.fullName} message={message.message} />
      </Table.Td>
      <Table.Td>{formatTime.DateTimeHours(message.createdAt)}</Table.Td>
      <Table.Td>
        <MessageDeleteModal id={message.id} />
      </Table.Td>
    </Table.Tr>
  ));
  return (
    <>
      <Table highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>N</Table.Th>
            <Table.Th>Ism</Table.Th>
            <Table.Th>Xabar</Table.Th>
            <Table.Th>Vaqti</Table.Th>
            <Table.Th>O'chirish</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </>
  );
};

export default MessagesTable;
