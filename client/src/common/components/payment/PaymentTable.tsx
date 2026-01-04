import { Badge, Table } from "@mantine/core";
import { formatTime } from "@/utils/helper";
import { IPayments } from "@/types";
import PaymentRefundModal from "./PaymentRefundModal";
import PaymentRefundReasonModal from "./PaymentRefundReasonModal";
const PaymentTable = ({
  payments,
  studentId,
}: {
  payments: IPayments[];
  studentId: number;
}) => {
  const rows = payments?.map((payment: IPayments, index: number) => (
    <Table.Tr key={index}>
      <Table.Td>{payment.amount}</Table.Td>
      <Table.Td>{formatTime.DateTimeHours(payment?.paymentDate)}</Table.Td>
      <Table.Td>
        <Badge component="span" color={payment.isRefunded ? "red" : "green"}>
          {payment.status}
        </Badge>
      </Table.Td>
      <Table.Td>
        <PaymentRefundModal
          disabled={payment.isRefunded}
          studentId={studentId}
          payment={payment}
        />
      </Table.Td>
      <Table.Td>
        <PaymentRefundReasonModal
          disabled={!payment.isRefunded}
          id={payment.id}
        />
      </Table.Td>
    </Table.Tr>
  ));
  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>To'lov miqdori</Table.Th>
          <Table.Th>To'lov sanasi</Table.Th>
          <Table.Th>To'lov statusi</Table.Th>
          <Table.Th>Bekor qilish</Table.Th>
          <Table.Th>Bekor sababi</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
};
export default PaymentTable;
