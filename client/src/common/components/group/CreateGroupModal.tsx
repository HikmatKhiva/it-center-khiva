import { Button, Modal, Stack, TextInput, Select, Grid } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { createGroupValidation } from "@/validation";
import { useAppSelector } from "@/hooks/redux";
import useFormData from "@/hooks/useFormData";
import { selectUser } from "@/lib/redux/reducer/admin";
import { useEffect, useRef, useState } from "react";
import {
  createNotification,
  showErrorNotification,
  showSuccessNotification,
} from "@/utils/notification";
import { Server } from "@/api/api";
import { duration, weekType } from "@/config";
import { ISelect, INewGroup, ISlotsResponse, IMessageResponse } from "@/types";
const CreateGroupModal = () => {
  const admin = useAppSelector(selectUser);
  const idNotification = useRef<string>("");
  const [opened, { open, close }] = useDisclosure(false);
  const { courses, loading, teachers, rooms } = useFormData();
  const [slots, setSlots] = useState<null | ISelect[]>(null);
  const client = useQueryClient();
  const form = useForm({
    initialValues: {
      name: "",
      courseId: "",
      teacherId: "",
      duration: 6,
      price: 100000,
      schedules: {
        weekType: "",
        time: "",
        roomId: "",
      },
    } as INewGroup,
    validate: createGroupValidation,
  });
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

  // Second effect to reset time and weekType when roomId changes
  useEffect(() => {
    if (form.values.schedules.roomId) {
      form.setValues({
        ...form.values,
        schedules: {
          ...form.values.schedules,
          time: "", // Reset time
          weekType: "", // Reset weekType
        },
      });
    }
  }, [form.values.schedules.roomId]);
  const { isPending, mutateAsync } = useMutation({
    mutationFn: (group: INewGroup) =>
      Server<IMessageResponse>(`group/create`, {
        method: "POST",
        body: JSON.stringify(group),
        headers: {
          authorization: `Bearer ${admin?.token}`,
        },
      }),
    onSuccess: (success) => {
      client.invalidateQueries({ queryKey: ["groups"] });
      showSuccessNotification(idNotification.current, success?.message);
      form.reset();
      setSlots(null);
      close();
    },
    onError: (error) => {
      showErrorNotification(idNotification.current, error.message);
    },
  });
  const handleSubmit = async (group: INewGroup) => {
    idNotification.current = createNotification(isPending);
    mutateAsync(group);
  };
  return (
    <>
      <Button
        onClick={open}
        aria-label="open group create modal"
        aria-labelledby="open group create modal"
        color="green"
        type="button"
        fz="xs"
        rightSection={<Pencil size={16} />}
        variant="filled"
      >
        Guruh Yaratish
      </Button>
      <Modal opened={opened} onClose={close} title="Guruh yaratish">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Guruh nomini kiriting!"
              placeholder="Dasturlash"
              size="sm"
              value={form.values.name}
              onChange={(event) =>
                form.setFieldValue("name", event.target.value)
              }
              error={form.errors.name}
              radius="md"
            />
            <Grid>
              <Grid.Col span={6}>
                <Select
                  label="Kurs davomiyligini tanlang!"
                  placeholder="6 oy"
                  data={duration}
                  {...form.getInputProps("duration")}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="To'lov summasini kiriting!"
                  placeholder="100000"
                  size="sm"
                  value={form.values.price}
                  onChange={(event) => {
                    const value = event.target.value;
                    if (/^\d*$/.test(value)) {
                      form.setFieldValue("price", +value);
                    }
                  }}
                  error={form.errors.price}
                  radius="md"
                />
              </Grid.Col>
            </Grid>
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
            {/* <TextInput
              label="Guruh vaqtini kiriting"
              placeholder="Juft 14:00"
              size="sm"
              value={form.values.groupTime}
              onChange={(event) =>
                form.setFieldValue("groupTime", event.target.value)
              }
              error={form.errors?.groupTime}
              radius="md"
            /> */}
            <Select
              label="Kursni tanlang!"
              disabled={loading}
              placeholder="Kursni tanlang!"
              {...form.getInputProps("courseId")}
              data={courses}
            />
            <Select
              disabled={loading}
              label="O'qituvchini tanlang!"
              placeholder="O'qituvchini tanlang!"
              {...form.getInputProps("teacherId")}
              data={teachers}
            />
          </Stack>
          <Button
            loading={isPending}
            disabled={
              isPending ||
              Object.entries(form.errors).flat(Infinity).length !== 0
            }
            size="sm"
            mt="15"
            color="green"
            type="submit"
            radius="md"
          >
            Yaratish
          </Button>
        </form>
      </Modal>
    </>
  );
};
export default CreateGroupModal;