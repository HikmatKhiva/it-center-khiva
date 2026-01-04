import { Server } from "@/api/api";
import { useAppSelector } from "@/hooks/redux";
import { selectUser } from "@/lib/redux/reducer/admin";
import { IRefund } from "@/types";
import { Button, Modal, NumberInput, Textarea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { Eye } from "lucide-react";
import { useEffect, useState } from "react";

const PaymentRefundReasonModal = ({
  disabled,
  id,
}: {
  disabled: boolean;
  id: number;
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const admin = useAppSelector(selectUser);
  const [values, setValues] = useState({
    reason: "",
    amount: 0,
  });
  const { data } = useQuery({
    queryKey: ["refund", id],
    queryFn: () =>
      Server<IRefund>(`payment/refund/${id}`, {
        method: "GET",
        headers: { authorization: `Bearer ${admin?.token}` },
      }),
    enabled: !!id && !!admin?.token && opened,
  });
  useEffect(() => {
    if (data) {
      setValues({ amount: parseInt(data.amount, 10), reason: data.reason });
    }
  }, [data]);
  return (
    <>
      <Button
        disabled={disabled}
        type="button"
        size="compact-md"
        color="red"
        variant="light"
        onClick={open}
      >
        <Eye size={16} />
      </Button>
      <Modal opened={opened} onClose={close}>
        <form>
          <NumberInput
            value={values.amount}
            label="Bekor qilingan summa!"
            readOnly
            placeholder="10000"
          />
          <Textarea
            value={values.reason}
            label="Bekor qilish sababi!"
            placeholder="To'lov bekor qilish sababi..."
            rows={5}
            mt={15}
          />
        </form>
      </Modal>
    </>
  );
};

export default PaymentRefundReasonModal;
