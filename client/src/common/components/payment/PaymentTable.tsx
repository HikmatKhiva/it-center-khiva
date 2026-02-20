import { Badge, Table } from "@mantine/core";
import { formatTime } from "@/utils/helper";
import { IPayments } from "@/types";
import PaymentMenu from "./PaymentMenu";
const PaymentTable = ({
  payments,
  studentId,
}: {
  payments: IPayments[];
  studentId: number;
}) => {
  const rows = payments?.map((payment: IPayments, index: number) => (
    <Table.Tr key={index}>
      <Table.Td>
        <Badge component="span" color={payment.isRefunded ? "red" : "blue"}>
          {payment.amount}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Badge component="span" color={payment.isRefunded ? "red" : "blue"}>
          {formatTime.DateTimeHours(payment?.paymentDate)}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Badge component="span" color={payment.isRefunded ? "red" : "blue"}>
          {payment.status}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Badge component="span" color={payment.isRefunded ? "red" : "blue"}>
          {String(payment?.createdBy?.role)}
        </Badge>
      </Table.Td>
      <Table.Td>
        <PaymentMenu studentId={studentId} payment={payment} />
      </Table.Td>
    </Table.Tr>
  ));
  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>To'lov miqdori</Table.Th>
          <Table.Th>To'lov sanasi</Table.Th>
          <Table.Th>Statusi</Table.Th>
          <Table.Th>Kim tominidan</Table.Th>
          <Table.Th>Sozlamalar</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
};
export default PaymentTable;