import { Server } from "@/api/api";
import { useAppSelector } from "@/hooks/redux";
import { selectUser } from "@/lib/redux/reducer/admin";
import { IRefund } from "@/types";
import { formatTime } from "@/utils/helper";
import {
  Badge,
  Group,
  Modal,
  NumberInput,
  Stack,
  Text,
  Textarea,
} from "@mantine/core";
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
        <Stack align="center" mb={20}>
          <Group gap="5" align="end">
            <Text fw={500} className="text-center">
              Kim tomonidan bekor qilingan:
            </Text>
            <Badge component="span" color="red">
              {String(data?.cancelledBy?.role)}
            </Badge>
          </Group>
          <Group align="end" gap="5">
            <Text fw={500} className="text-center">
              Bekor qilingan sana:
            </Text>
            <Badge hidden={!data?.createdAt} component="span">
              {data?.createdAt ? formatTime.DateTimeHours(data?.createdAt) : ""}
            </Badge>
          </Group>
        </Stack>
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