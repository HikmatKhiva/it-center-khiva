import { ActionIcon, Button, Grid, Modal, Select, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { PenIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "@/hooks/redux";
import { selectUser } from "@/lib/redux/reducer/admin";
import {
  createNotification,
  showErrorNotification,
  showSuccessNotification,
} from "@/utils/notification";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { updateGroupValidation } from "@/validation";
import useFormData from "@/hooks/useFormData";
import { useForm } from "@mantine/form";
import { Server } from "@/api/api";
import {
  IGroup,
  IMessageResponse,
  ISelect,
  ISlotsResponse,
  IUpdateGroup,
} from "@/types";
import { weekType } from "@/config";
const UpdateGroupModal = ({ id }: { id: number }) => {
  const admin = useAppSelector(selectUser);
  const idNotification = useRef<string>("");
  const [opened, { open, close }] = useDisclosure(false);
  const { loading, teachers, rooms } = useFormData();
  const client = useQueryClient();
  const { data } = useQuery({
    queryKey: ["group", id],
    queryFn: () => {
      if (id) {
        return Server<IGroup>(`group/${id}`, {
          method: "GET",
          headers: {
            authorization: `Bearer ${admin?.token}`,
          },
        });
      }
    },
    enabled: !!id && !!admin?.token,
  });
  const form = useForm({
    initialValues: {
      teacherId: data?.teacher.id.toString() || "",
      schedules: {
        weekType: "",
        time: "",
        roomId: "",
      },
    } as IUpdateGroup,
    validate: updateGroupValidation,
  });
  useEffect(() => {
    if (data) {
      form.setFieldValue("teacherId", data?.teacher?.id.toString() || "");
      form.setFieldValue(
        "schedules.weekType",
        data?.schedules[0]?.weekType || ""
      );
      form.setFieldValue("schedules.time", data?.schedules[0]?.time || "");
      form.setFieldValue(
        "schedules.roomId",
        data?.schedules[0]?.roomId.toString()
      );
    }
  }, [data]);
  const { isPending, mutateAsync } = useMutation({
    mutationFn: (data: IUpdateGroup) =>
      Server<IMessageResponse>(`group/update/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          authorization: `Bearer ${admin?.token}`,
        },
      }),
    onSuccess: (success) => {
      showSuccessNotification(idNotification.current, success?.message);
      client.invalidateQueries({ queryKey: ["group", id] });
      close();
    },
    onError: (error) => {
      showErrorNotification(idNotification.current, error.message);
    },
  });
  const handleSubmit = async (group: IUpdateGroup) => {
    idNotification.current = createNotification(isPending);
    mutateAsync(group);
  };
  useEffect(() => {
    const { roomId, weekType } = form.values.schedules;
    const params = new URLSearchParams({
      weekType: weekType,
    });
    if (roomId && weekType) {
      const fetchRoomData = async () => {
        const request = await Server<ISlotsResponse>(
          `room/time/${roomId}?=${params}`,
          {
            method: "GET",
          }
        );
        if (request?.slots) {
          setSlots(request.slots);
        } else {
          setSlots(null);
        }
      };
      fetchRoomData();
    }
  }, [form.values.schedules.roomId, form.values.schedules.weekType]);
  const [slots, setSlots] = useState<null | ISelect[]>(null);
  return (
    <>
      <ActionIcon onClick={open}>
        <PenIcon size="16" />
      </ActionIcon>
      <Modal opened={opened} onClose={close} title="Guruh yangilash">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <Select
              label="Dars xonani tanlang!"
              placeholder="1.1"
              data={rooms}
              {...form.getInputProps("schedules.roomId")}
            />
            <Grid>
              <Grid.Col span={6}>
                <Select
                  label="Dars kunlari tanlang!"
                  placeholder="Toq | Juft"
                  data={weekType}
                  {...form.getInputProps("schedules.weekType")}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Select
                  label="Dars vaqtlari tanlang!"
                  disabled={!slots}
                  {...form.getInputProps("schedules.time")}
                  placeholder="9:00"
                  data={slots ?? []}
                />
              </Grid.Col>
            </Grid>
            <Select
              disabled={loading}
              label="O'qituvchini tanlang..."
              placeholder="O''qituvchini tanlang..."
              {...form.getInputProps("teacherId")}
              data={teachers}
            />
          </Stack>
          <Button
            loading={isPending}
            disabled={isPending}
            size="sm"
            mt="15"
            color="green"
            type="submit"
            radius="md"
          >
            Yangilash.
          </Button>
        </form>
      </Modal>
    </>
  );
};
export default UpdateGroupModal;
