import { Table } from "@mantine/core";
import { formatTime } from "@/utils/helper";
const PaymentTable = ({ payments }: { payments: IPayments[] }) => {
  const rows = payments?.map((payment: IPayments, index: number) => (
    <Table.Tr key={index}>
      <Table.Td>{payment.amount}</Table.Td>
      <Table.Td>{formatTime.DateTimeHours(payment?.paymentDate)}</Table.Td>
      <Table.Td>{payment.status}</Table.Td>
    </Table.Tr>
  ));
  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>To'lov miqdori</Table.Th>
          <Table.Th>To'lov sanasi</Table.Th>
          <Table.Th>To'lov statusi</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
};
export default PaymentTable;