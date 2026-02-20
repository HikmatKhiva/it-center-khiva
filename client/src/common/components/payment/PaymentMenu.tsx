import { useState } from "react";
import { Menu, Button } from "@mantine/core";
import { Eye, ReceiptText, Settings, X } from "lucide-react";
import PaymentRefundModal from "./PaymentRefundModal";
import { IPayments } from "@/types";
import PaymentRefundReasonModal from "./PaymentRefundReasonModal";
import PaymentReceiptModal from "./PaymentReceiptModal";
const PaymentMenu = ({
  payment,
  studentId,
}: {
  payment: IPayments;
  studentId: number;
}) => {
  const [modalOpened, setModalOpened] = useState<boolean>(false);
  const [reasonModalOpened, setReasonModalOpened] = useState<boolean>(false);
  const [receiptModalOpened, setReceiptModalOpened] = useState<boolean>(false);
  return (
    <>
      <Menu shadow="md" width={200}>
        <Menu.Target>
          <Button variant="default" size="compact-md">
            <Settings size={16} />
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            rightSection={<ReceiptText size={16} />}
            onClick={() => setReceiptModalOpened(true)}
          >
            Receipt
          </Menu.Item>
          <Menu.Item
            disabled={payment?.isRefunded}
            onClick={() => setModalOpened(true)}
            rightSection={<X size={16} />}
          >
            Bekor qilish
          </Menu.Item>
          <Menu.Item
            disabled={!payment?.isRefunded}
            onClick={() => setReasonModalOpened(true)}
            rightSection={<Eye size={16} />}
          >
            Bekor qilish Sababi
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <PaymentRefundModal
        studentId={studentId}
        payment={payment}
        opened={modalOpened}
        close={() => setModalOpened(false)}
      />
      <PaymentRefundReasonModal
        opened={reasonModalOpened}
        close={() => setReasonModalOpened(false)}
        id={payment.id}
      />
      <PaymentReceiptModal
        opened={receiptModalOpened}
        close={() => setReceiptModalOpened(false)}
        paymentId={payment?.id}
      />
    </>
  );
};
export default PaymentMenu;