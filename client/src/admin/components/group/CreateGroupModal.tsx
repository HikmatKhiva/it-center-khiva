import { Button, Modal, Stack, TextInput, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGroup } from "@/admin/api/api.group";
import { Pencil } from "lucide-react";
import { createGroupValidation } from "@/validation";
import { useAppSelector } from "@/hooks/redux";
import useFormData from "@/hooks/useFormData";
import { selectUser } from "@/lib/redux/reducer/admin";
import { useRef } from "react";
import {
  createNotification,
  showErrorNotification,
  showSuccessNotification,
} from "@/utils/notification";
const CreateGroupModal = () => {
  const admin = useAppSelector(selectUser);
  const idNotification = useRef<string>("");
  const [opened, { open, close }] = useDisclosure(false);
  const { courses, loading, teachers } = useFormData();
  const client = useQueryClient();
  const form = useForm({
    initialValues: {
      name: "",
      courseId: "",
      teacherId: "",
      duration: 6,
      price: 100000,
      groupTime: "",
      // groupTime: {
      //   day: "",
      //   hour: "",
      // },
    } as INewGroup,
    validate: createGroupValidation,
  });
  const { isPending, mutateAsync } = useMutation({
    mutationFn: (group: INewGroup) => createGroup(group, admin?.token || ""),
    onSuccess: (success) => {
      client.invalidateQueries({ queryKey: ["groups"] });
      showSuccessNotification(idNotification.current, success?.message);  
      form.reset();
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
              label="Guruh nomini kiriting"
              placeholder="Dasturlash"
              size="sm"
              value={form.values.name}
              onChange={(event) =>
                form.setFieldValue("name", event.target.value)
              }
              error={form.errors.name}
              radius="md"
            />
            <TextInput
              label="Qancha oy davom etishi belgilang!"
              placeholder="6"
              size="sm"
              min={1} 
              max={13}
              maxLength={2}
              value={form.values.duration}
              onChange={(event) => {
                const value = event.target.value;
                if (/^\d*$/.test(value)) {
                  form.setFieldValue("duration", +value);
                }
              }}
              error={form.errors.duration}
              radius="md"
            />
            <TextInput
              label="Oylik To'lov summasini kiriting!"
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
            {/* <Group>
              <Select
                label="Dars kunlari"
                placeholder="Dushanba"
                data={weeks}
                {...form.getInputProps("groupTime.day")}
              />
              <Select
                label="Dars vaqtlari"
                {...form.getInputProps("groupTime.hour")}
                placeholder="9:00"
                data={workHours}
              />
            </Group> */}
            <TextInput
              label="Guruh vaqtini kiriting"
              placeholder="Juft 14:00"
              size="sm"
              value={form.values.groupTime}
              onChange={(event) =>
                form.setFieldValue("groupTime", event.target.value)
              }
              error={form.errors?.groupTime}
              radius="md"
            />
            <Select
              label="Kursni tanlang..."
              disabled={loading}
              placeholder="Kursni tanlang..."
              {...form.getInputProps("courseId")}
              data={courses}
            />
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
            Yaratish
          </Button>
        </form>
      </Modal>
    </>
  );
};
export default CreateGroupModal;