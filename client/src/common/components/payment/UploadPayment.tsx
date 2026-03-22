import { Button, Group, Modal, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, Wallet, PoundSterling } from "lucide-react";
import { createPaymentValidation } from "@/validation";
import { useRef } from "react";
import { useAppSelector } from "@/hooks/redux";
import {
  createNotification,
  showErrorNotification,
  showSuccessNotification,
} from "@/utils/notification";
import { selectUser } from "@/lib/redux/reducer/admin";
import { Server } from "@/api/api";
import { DateTimePicker } from "@mantine/dates";
import { INewPayment, IMessageResponse } from "@/types";
const UploadPayment = ({ studentId }: { studentId: number }) => {
  const admin = useAppSelector(selectUser);
  const [opened, { open, close }] = useDisclosure(false);
  const idNotification = useRef<string>("");
  const client = useQueryClient();
  const form = useForm({
    initialValues: {
      studentId,
      amount: 0,
      paymentDate: new Date(),
    } as INewPayment,
    validate: createPaymentValidation,
  });
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: INewPayment) =>
      Server<IMessageResponse>(`payment/create`, {
        method: "POST",
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
  const handleSubmit = (data: INewPayment) => {
    idNotification.current = createNotification(isPending);
    mutateAsync(data);
  };
  return (
    <>
      <Button type="button" color="indigo" size="xs" onClick={open}>
        <Wallet size={16} />
      </Button>
      <Modal opened={opened} onClose={close} title="To'lovlarni kiritish!">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Group align="end">
            <TextInput
              flex="1"
              placeholder="10000"
              label="Summani Kiriting!"
              value={form.values.amount}
              rightSection={<PoundSterling size="16" />}
              error={form.errors.amount}
              onChange={(event) => {
                const value = event.target.value;
                if (/^\d*$/.test(value)) {
                  form.setFieldValue("amount", +value);
                }
              }}
            />
            <DateTimePicker
              flex="1"
              value={form.values.paymentDate}
              onChange={(date) => {
                if (date) form.setFieldValue("paymentDate", new Date(date));
              }}
              valueFormat="DD MMM YYYY hh:mm A"
              label="Enter payment date"
              placeholder="Select payment date"
              rightSection={<Calendar size={16} />}
            />
            {/* <FileButton onChange={() => {}} accept="image/png,image/jpeg">
              {(props) => (
                <Button {...props}>
                  <ReceiptText />
                </Button>
              )}
            </FileButton> */}
          </Group>
          <Button
            aria-labelledby="upload payment button"
            aria-label="upload payment button"
            size="sm"
            color="green"
            radius="md"
            loading={isPending}
            disabled={isPending}
            type="submit"
            mt={10}
          >
            Saqlash
          </Button>
        </form>
      </Modal>
    </>
  );
};
export default UploadPayment;
