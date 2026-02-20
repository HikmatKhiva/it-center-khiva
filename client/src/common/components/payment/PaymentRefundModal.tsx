import { Server } from "@/api/api";
import { useAppSelector } from "@/hooks/redux";
import { selectUser } from "@/lib/redux/reducer/admin";
import { IMessageResponse, IPaymentRefund, IPayments } from "@/types";
import {
  createNotification,
  showErrorNotification,
  showSuccessNotification,
} from "@/utils/notification";
import { paymentRefundValidation } from "@/validation";
import { Button, Modal, NumberInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {  PoundSterling } from "lucide-react";
import { useEffect, useRef } from "react";
const PaymentRefundModal = ({
  payment,
  studentId,
  opened,
  close,
}: {
  payment: IPayments;
  studentId: number;
  opened: boolean;
  close: () => void;
}) => {
  const admin = useAppSelector(selectUser);
  const idNotification = useRef<string>("");
  const client = useQueryClient();
  const form = useForm({
    initialValues: {
      amount: 0,
      reason: "",
    } as IPaymentRefund,
    validate: paymentRefundValidation,
  });
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: IPaymentRefund) =>
      Server<IMessageResponse>(`payment/refund/${payment.id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          authorization: `Bearer ${admin?.token}`,
        },
      }),
    mutationKey: ["payments"],
    onSuccess(success) {
      client.invalidateQueries({ queryKey: ["payments", studentId] });
      client.invalidateQueries({ queryKey: ["students"] });
      client.invalidateQueries({ queryKey: ["debtors"] });
      close();
      form.reset();
      showSuccessNotification(idNotification.current, success?.message);
    },
    onError: (error) => {
      showErrorNotification(idNotification.current, error.message);
    },
  });
  useEffect(() => {
    if (payment) {
      form.setFieldValue("amount", parseInt(payment.amount, 10));
    }
  }, [payment]);
  const handleSubmit = (data: IPaymentRefund) => {
    idNotification.current = createNotification(isPending);
    mutateAsync(data);
  };
  return (
    <>
      <Modal opened={opened} onClose={close}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <NumberInput
            flex="1"
            placeholder="10000"
            label="Summani Kiriting!"
            value={form.values.amount}
            rightSection={<PoundSterling size="16" />}
            error={form.errors.amount}
            {...form.getInputProps("amount")}
          />
          <Textarea
            label="Bekor qilish sababini kiriting!"
            placeholder="To'lov bekor qilish sababini kiriting..."
            rows={5}
            error={form.errors.reason}
            value={form.values.reason}
            mt={15}
            {...form.getInputProps("reason")}
          />
          <Button
            aria-labelledby="upload payment button"
            aria-label="upload payment button"
            size="sm"
            color="red"
            radius="md"
            loading={isPending}
            disabled={isPending}
            type="submit"
            mt={10}
          >
            To'lovni bekor qilish
          </Button>
        </form>
      </Modal>
    </>
  );
};
export default PaymentRefundModal;