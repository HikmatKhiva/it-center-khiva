import { Server } from "@/api/api";
import { useAppSelector } from "@/hooks/redux";
import { selectUser } from "@/lib/redux/reducer/admin";
import { IReceipt } from "@/types";
import { formatTime } from "@/utils/helper";
import {
  ActionIcon,
  Box,
  Divider,
  Group,
  List,
  Modal,
  Text,
} from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { Clipboard } from "lucide-react";
// import { useRef } from "react";
import QRCode from "react-qr-code";
// import { useReactToPrint } from "react-to-print";
// const baseUrl = import.meta.env.BASE_URL;
const baseUrl = window.location.origin;
// HACK: print func doesn't work
const PaymentReceiptModal = ({
  opened,
  close,
  paymentId,
}: {
  opened: boolean;
  close: () => void;
  paymentId: number;
}) => {
  const admin = useAppSelector(selectUser);
  //   const printRef = useRef<HTMLDivElement>(null);
  const { data } = useQuery({
    queryKey: ["receipt"],
    queryFn: () =>
      Server<IReceipt>(`receipt/${paymentId}`, {
        method: "GET",
        headers: { authorization: `Bearer ${admin?.token}` },
      }),
    enabled: !!paymentId && !!admin?.token && opened,
  });
  const clipboard = useClipboard({ timeout: 500 });
  const qrUrl = data?.publicToken
    ? `${baseUrl}/site/receipt/${data?.publicToken}`
    : "";
  const handleCopy = () => {
    clipboard.copy(qrUrl);
  };
  return (
    <>
      <Modal opened={opened} onClose={close} w={300}>
        <Group justify="center" w={"100%"}>
          <Box w={"100%"}>
            <Text className="text-center" size="xl" fw={700}>
              IT-Park Khiva MCHJ
            </Text>
            <Text className="text-center" size="lg" fw={500}>
              Receipt code: {data?.receiptNo}
            </Text>
            <Divider color="dark" size={3} mt={10} />
            <List mt={10} mb={10}>
              <List.Item>
                O'quvchi:{" "}
                {`${data?.student.firstName} ${data?.student.secondName}`}
              </List.Item>
              <List.Item>Kurs: {data?.student.course.name}</List.Item>
              <List.Item>Summa: {data?.amount}</List.Item>
              <List.Item>
                Sana:{" "}
                {formatTime.DateTimeHours(
                  data?.issuedAt ? data.issuedAt : new Date(),
                )}
              </List.Item>
              <List.Item>
                Chek xolati:{" "}
                {data?.status === "ACTIVE" ? "Active" : "Bekor qilingan!"}
              </List.Item>
            </List>
            <QRCode size={200} value={qrUrl} className="mx-auto" />
          </Box>
        </Group>
        <Divider color="dark" size={3} mt={20} />
        <ActionIcon.Group className="justify-end" mt={10}>
          <ActionIcon
            onClick={handleCopy}
            color="grape"
            aria-label="copy"
            size="input-sm"
          >
            <Clipboard size={16} />
          </ActionIcon>
        </ActionIcon.Group>
      </Modal>
    </>
  );
};
export default PaymentReceiptModal;