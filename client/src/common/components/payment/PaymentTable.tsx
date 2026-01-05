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
      <Table.Td>
        {/* {payment.amount} */}
        <Badge component="span" color={payment.isRefunded ? "red" : "blue"}>
          {payment.amount}
        </Badge>
      </Table.Td>
      <Table.Td>
        {/* {formatTime.DateTimeHours(payment?.paymentDate)} */}
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
      <Table.Td>
        <Badge hidden={!payment?.refundedAt} component="span" color={payment.isRefunded ? "red" : "blue"}>
          {payment?.refundedAt
            ? formatTime.DateTimeHours(payment?.refundedAt)
            : ""}
        </Badge>
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
          <Table.Th>Bekor qilish</Table.Th>
          <Table.Th>Sababini ko'rish</Table.Th>
          <Table.Th>Bekor qilingan sana</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
};
export default PaymentTable;
