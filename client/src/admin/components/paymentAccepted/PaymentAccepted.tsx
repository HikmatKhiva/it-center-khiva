import { NumberTicker } from "@/animation/number-ticker";
import { Server } from "@/api/api";
import PaymentsHistory from "@/common/components/payment/PaymentsHistory";
import { useAppSelector } from "@/hooks/redux";
import { selectUser } from "@/lib/redux/reducer/admin";
import { formatTime } from "@/utils/helper";
import {
  createNotification,
  showErrorNotification,
  showSuccessNotification,
} from "@/utils/notification";
import {
  Button,
  Checkbox,
  Group,
  LoadingOverlay,
  Modal,
  Pagination,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CheckCheck, EllipsisVertical } from "lucide-react";
import { useMemo, useRef, useState } from "react";
const PaymentAccepted = ({ isActive }: { isActive: boolean }) => {
  const admin = useAppSelector(selectUser);
  const [opened, { open, close }] = useDisclosure(false);
  const idNotification = useRef<string>("");
  const [query, setQuery] = useState<{
    date: Date | null;
    isConfirmed: string;
    limit: number;
    page: number;
    name: string;
  }>({
    date: null,
    isConfirmed: "PENDING",
    limit: 12,
    page: 1,
    name: "",
  });
  const params = useMemo(() => {
    return new URLSearchParams({
      date: query?.date?.toISOString()?.split("T")[0] ?? "",
      isConfirmed: query.isConfirmed ?? "",
      limit: query.limit.toString(),
      page: query.page.toString(),
      name: query.name,
    });
  }, [query]);
  const [selectedPayments, setSelectedPayments] = useState<ISelectedPayment[]>(
    [],
  );

  const checkedPayment = (id: number) => {
    return selectedPayments.some((item) => (item.id === id ? true : undefined));
  };
  const {
    data: adminPayment,
    isPending,
    refetch,
  } = useQuery({
    queryKey: ["adminPayment", query.date, query.isConfirmed, query.name],
    queryFn: () =>
      Server<IAdminPaymentResponse>(`admin/payments?${params}`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${admin?.token}`,
        },
      }),
    enabled: isActive && !!admin?.token,
  });
  const calculateTotal = useMemo(() => {
    const confirmedSum =
      adminPayment?.payments?.reduce((sum, payment) => {
        return (
          sum + (payment.confirmedStatus === "CONFIRMED" ? payment.amount : 0)
        );
      }, 0) ?? 0;

    const selectedSum = selectedPayments.reduce(
      (sum, payment) => sum + payment.amount,
      0,
    );

    return confirmedSum + selectedSum;
  }, [selectedPayments, adminPayment]);
  const { mutateAsync } = useMutation({
    mutationKey: ["updateAdminPayment"],
    mutationFn: (data: ISelectedPayment[]) =>
      Server<IMessageResponse>(`admin/payments/confirmed`, {
        method: "PATCH",
        headers: {
          authorization: `Bearer ${admin?.token}`,
        },
        body: JSON.stringify(data),
      }),
    onSuccess: (success) => {
      showSuccessNotification(idNotification.current, success?.message);
      setSelectedPayments([]);
      refetch();
      close();
    },
    onError: (error) => {
      showErrorNotification(idNotification.current, error.message);
    },
  });
  const handleConfirmSubmit = async () => {
    idNotification.current = createNotification(isPending);
    await mutateAsync(selectedPayments);
  };
  const rows = adminPayment?.payments?.map((payment: IAdminPayment) => (
    <Table.Tr key={payment.id}>
      <Table.Td>
        <Checkbox
          color="indigo"
          aria-label="Select row"
          checked={
            checkedPayment(payment.id) ||
            payment.confirmedStatus === "CONFIRMED"
          }
          disabled={payment.confirmedStatus === "CONFIRMED"}
          onChange={(event) => {
            if (event.currentTarget.checked) {
              setSelectedPayments((prev) =>
                prev.some((item) => item.id === payment.id)
                  ? prev
                  : [
                      ...prev,
                      {
                        id: payment.id,
                        amount: payment.amount,
                        confirmedStatus: payment.confirmedStatus,
                      },
                    ],
              );
            } else {
              setSelectedPayments((prev) =>
                prev.filter((item) => item.id !== payment.id),
              );
            }
          }}
        />
      </Table.Td>
      <Table.Td>{payment.id}</Table.Td>
      <Table.Td>{payment.fullName}</Table.Td>
      <Table.Td>{payment.groupName}</Table.Td>
      <Table.Td>{payment.teacherName}</Table.Td>
      <Table.Td>{payment.courseName}</Table.Td>
      <Table.Td>
        <Group gap={5}>
          <Text>{payment.amount}</Text>
          {payment.confirmedStatus === "CONFIRMED" && <CheckCheck size={16} />}
        </Group>
      </Table.Td>
      <Table.Td>{formatTime.DateTimeHours(payment.paymentDate)}</Table.Td>
      <Table.Td>
        {payment?.confirmedAt
          ? formatTime.DateTimeHours(payment?.confirmedAt)
          : "Kutilyapdi"}
      </Table.Td>
      <Table.Td>
        <PaymentsHistory id={payment.studentId} />
      </Table.Td>
    </Table.Tr>
  ));
  return (
    <div>
      <Group justify="space-between" mb={20}>
        <Title order={2}>
          Total: <NumberTicker value={calculateTotal} />
        </Title>
        <Group>
          <TextInput
            value={query.name}
            onChange={(event) =>
              setQuery((prev) => ({ ...prev, name: event.target.value }))
            }
            placeholder="Ism..."
            w={150}
          />
          <DateInput
            clearable
            placeholder="Sana..."
            value={query.date}
            onChange={(value) =>
              setQuery((prev) => ({
                ...prev,
                date: value ? new Date(value) : null,
              }))
            }
            w={150}
          />
          <Select
            placeholder="To'lov status..."
            clearable
            value={query.isConfirmed}
            onChange={(value) =>
              setQuery((prev) => ({ ...prev, isConfirmed: value ?? "" }))
            }
            w={150}
            data={[
              { label: "Tasdiqlangan", value: "CONFIRMED" },
              { label: "Kutilayotgan", value: "PENDING" },
            ]}
          />
          <Button
            disabled={calculateTotal === 0}
            size="compact-lg"
            color="indigo"
            onClick={open}
          >
            Tasdiqlash
          </Button>
        </Group>
      </Group>
      <Stack className="h-[calc(100vh-290px)]" justify="space-between ">
        <Table withTableBorder highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>
                <EllipsisVertical size={16} />
              </Table.Th>
              <Table.Th>Id</Table.Th>
              <Table.Th>O'quvchi</Table.Th>
              <Table.Th>Guruh</Table.Th>
              <Table.Th>O'qituvchisi</Table.Th>
              <Table.Th>Kurs</Table.Th>
              <Table.Th>To'lov miqdori</Table.Th>
              <Table.Th>To'lov sanasi</Table.Th>
              <Table.Th>Tasdiqlangan sanasi</Table.Th>
              <Table.Th>To'lov tarixi</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
        <LoadingOverlay visible={isPending} />
        <Pagination
          value={query.page}
          className="self-end"
          color="indigo"
          hidden={(adminPayment?.totalPages ?? 0) <= 1 || isPending}
          onChange={(pageNumber) => setQuery({ ...query, page: pageNumber })}
          total={adminPayment?.totalPages || 1}
        />
      </Stack>
      <Modal title="To'lovlarni tasdiqlash!" opened={opened} onClose={close}>
        <Title order={3} className="text-center" size="lg">
          Ushu summani tasdiqlaysizmi: <NumberTicker value={calculateTotal} />
        </Title>
        <Group justify="center" my={20}>
          <Button onClick={close} color="red">
            Yoq
          </Button>
          <Button color="green" onClick={handleConfirmSubmit}>
            Ha
          </Button>
        </Group>
      </Modal>
    </div>
  );
};
export default PaymentAccepted;