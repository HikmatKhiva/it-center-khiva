import { useDisclosure } from "@mantine/hooks";
import {
  Drawer,
  Button,
  Text,
  Group,
  RingProgress,
  Stack,
  ActionIcon,
  Center,
} from "@mantine/core";
import { Check, ReceiptText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import PaymentTable from "./PaymentTable";
import { useAppSelector } from "@/hooks/redux";
import { selectUser } from "@/lib/redux/reducer/admin";
import { Server } from "@/api/api";
const PaymentsHistory = ({ id }: { id: number }) => {
  const admin = useAppSelector(selectUser);
  const [opened, { open, close }] = useDisclosure(false);
  const { data } = useQuery<IPaymentsResponse>({
    queryKey: ["payments", id],
    queryFn: () =>
      Server<IPaymentsResponse>(`payment/${id}`, {
        method: "GET",
        headers: { authorization: `Bearer ${admin?.token}` },
      }),
    enabled: !!id && !!admin?.token && opened,
  });
  return (
    <>
      <Drawer
        opened={opened}
        onClose={close}
        title={`${data?.student?.firstName}`}
      >
        <Stack justify="space-between" h={"100%"}>
          <PaymentTable payments={data?.payments || []} />
          <Group justify="center">
            <RingProgress
              sections={[
                {
                  value: data?.percentagePaid || 0,
                  color: data?.percentagePaid === 100 ? "teal" : "blue",
                },
              ]}
              rootColor="red"
              label={
                <Center>
                  {data?.percentagePaid === 100 ? (
                    <ActionIcon
                      color="teal"
                      variant="light"
                      radius="xl"
                      size="xl"
                    >
                      <Check size={22} />
                    </ActionIcon>
                  ) : (
                    <Text c="red" fw={700} ta="center" size="md">
                      {data?.student?.debt || ""} <br />
                      {!isNaN(data?.percentagePaid || 0)
                        ? `${Math.floor(data?.percentagePaid || 0)}%`
                        : ""}
                    </Text>
                  )}
                </Center>
              }
            />
          </Group>
        </Stack>
      </Drawer>
      <Button size="xs" variant="default" onClick={open}>
        <ReceiptText size={16} />
      </Button>
    </>
  );
};
export default PaymentsHistory;