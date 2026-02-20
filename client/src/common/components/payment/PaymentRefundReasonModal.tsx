import { Server } from "@/api/api";
import { useAppSelector } from "@/hooks/redux";
import { selectUser } from "@/lib/redux/reducer/admin";
import { IRefund } from "@/types";
import { formatTime } from "@/utils/helper";
import { Badge, Modal, NumberInput, Text, Textarea } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
const PaymentRefundReasonModal = ({
  id,
  opened,
  close,
}: {
  id: number;
  opened: boolean;
  close: () => void;
}) => {
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
      <Modal opened={opened} onClose={close}>
        <Text fw={500} className="text-center" mb={20}>
          Bekor qilingan sana:{" "}
          <Badge hidden={!data?.createdAt} component="span">
            {data?.createdAt ? formatTime.DateTimeHours(data?.createdAt) : ""}
          </Badge>
        </Text>
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