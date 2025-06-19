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
  Tabs,
} from "@mantine/core";
import { ChartArea, Check, ReceiptText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import PaymentTable from "./PaymentTable";
import { useAppSelector } from "@/hooks/redux";
import { selectUser } from "@/lib/redux/reducer/admin";
import { Server } from "@/api/api";
import PaymentMonthly from "./PaymentMonthly";
const PaymentsHistory = ({ id }: { id: number }) => {
  const admin = useAppSelector(selectUser);
  const [opened, { open, close }] = useDisclosure(false);
  const { data } = useQuery({
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
      <Drawer opened={opened} onClose={close}>
        <Group mb="10" justify="space-between" px="20">
          <Text>
            O'quvchi: <strong>{data?.student?.firstName}</strong>
          </Text>
          <Text>
            Kurs davomiyligi: <strong>{data?.student?.Group.duration}</strong>{" "}
          </Text>
        </Group>
        <Group mb="10" justify="space-between" px="20">
          <Text>
            Oylik to'lovi: <strong>{data?.student?.Group.price}</strong>
          </Text>
          <Text>
            Berilgan chegirma: <strong>{data?.student?.discount}%</strong>
          </Text>
        </Group>
        <Tabs defaultValue="total" orientation="horizontal">
          <Tabs.List mb="20">
            <Tabs.Tab fz="lg" value="total" rightSection={<ReceiptText size="16" />}>Umumiy</Tabs.Tab>
            <Tabs.Tab fz="lg" value="monthly" rightSection={<ChartArea size="16" />}>Oylik to'lovlari</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="total">
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
          </Tabs.Panel>
          <Tabs.Panel value="monthly">
            <PaymentMonthly monthly={data?.monthly || []} />
          </Tabs.Panel>
        </Tabs>
      </Drawer>
      <Button size="xs" variant="default" onClick={open}>
        <ReceiptText size={16} />
      </Button>
    </>
  );
};
export default PaymentsHistory;