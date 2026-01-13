import { useDisclosure } from "@mantine/hooks";
import { Button, Group, Modal, Text } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check } from "lucide-react";
import confetti from "canvas-confetti";
import { useAppSelector } from "@/hooks/redux";
import { memo, useRef } from "react";
import { selectUser } from "@/lib/redux/reducer/admin";
import {
  createNotification,
  showErrorNotification,
  showSuccessNotification,
} from "@/utils/notification";
import { Server } from "@/api/api";
import { IMessageResponse } from "@/types";
const FinishGroupModal = memo(({ id }: { id: number }) => {
  const admin = useAppSelector(selectUser);
  const [opened, { open, close }] = useDisclosure(false);
  const idNotification = useRef<string>("");
  const client = useQueryClient();
  const frame = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;
    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };
  const { mutateAsync, isPending } = useMutation({
    mutationFn: () =>
      Server<IMessageResponse>(`group/finish/${id}`, {
        method: "PATCH",
        headers: {
          authorization: `Bearer ${admin?.token}`,
        },
      }),
    onSuccess(success) {
      client.invalidateQueries({ queryKey: ["group", id] });
      frame();
      showSuccessNotification(idNotification.current, success?.message);
      close();
    },
    onError: (error) => {
      showErrorNotification(idNotification.current, error.message);
      close();
    },
  });
  const handleSubmit = async () => {
    idNotification.current = createNotification(isPending);
    await mutateAsync();
  };
  return (
    <>
      <Button
        onClick={open}
        aria-label="finish group button"
        aria-labelledby="finish group button"
        color="green"
        variant="outline"
        fz={"xs"}
        rightSection={<Check size={16} />}
      >
        Guruhni yakunlash.
      </Button>
      <Modal centered opened={opened} onClose={close} title="Guruhni yakunlash">
        <Text size="md" className="text-center">
          Siz ushbu guruhni yakunlashni xohlaysizmi?
        </Text>
        <Group mt={20} justify="end" gap="10">
          <Button loading={isPending} color="green" onClick={handleSubmit}>
            Ha
          </Button>
          <Button color="red" variant="outline" onClick={close}>
            Yo'q
          </Button>
        </Group>
      </Modal>
    </>
  );
});
export default FinishGroupModal;