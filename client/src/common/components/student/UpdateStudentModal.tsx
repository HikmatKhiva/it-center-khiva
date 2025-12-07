import { useDisclosure } from "@mantine/hooks";
import { Button, Modal, Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "@/hooks/redux";
import { selectUser } from "@/lib/redux/reducer/admin";
import { InputMask } from "@react-input/mask";
import { useRef } from "react";
import {
  createNotification,
  showSuccessNotification,
} from "@/utils/notification";
import { Pencil } from "lucide-react";
import { Server } from "@/api/api";
const UpdateStudentModal = ({ student }: { student: IStudent }) => {
  const client = useQueryClient();
  const admin = useAppSelector(selectUser);
  const idNotification = useRef<string>("");
  const [opened, { open, close }] = useDisclosure(false);
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: IStudent) =>
      Server<IMessageResponse>(`students/update/${student.id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          authorization: `Bearer ${admin?.token}`,
        },
      }),
    onSuccess: (success) => {
      client.invalidateQueries({ queryKey: ["students"] });
      showSuccessNotification(idNotification.current, success?.message);
      close();
    },
  });
  const form = useForm({
    initialValues: {
      firstName: student?.firstName,
      secondName: student?.secondName,
      passportId: student?.passportId,
      gender: student?.gender.toLowerCase(),
      phone: student?.phone,
    } as IStudent,
  });
  const handleSubmit = async (data: IStudent) => {
    mutateAsync(data);
    idNotification.current = createNotification(isPending);
  };
  return (
    <>
      <Button
        onClick={open}
        rightSection={<Pencil size="16" />}
        color="green"
        size="xs"
        variant="outline"
      >
        O'zgartirish
      </Button>
      <Modal opened={opened} onClose={close} title="O'quvchini o'zgartirish">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              onChange={(e) =>
                form.setFieldValue("firstName", e.target.value.trim())
              }
              value={form.values.firstName}
              error={form.errors.firstName}
              label="Ismini kiriting!"
              placeholder="Xudayshukur"
              size="md"
              radius="md"
            />
            <TextInput
              onChange={(e) =>
                form.setFieldValue("secondName", e.target.value.trim())
              }
              value={form.values.secondName}
              error={form.errors.secondName}
              required
              label="Familiyasini kiriting!"
              placeholder="Polvonov"
              size="md"
              radius="md"
            />
            <InputMask
              mask="+99 (8__) ___-__-__"
              replacement={{ _: /\d/ }}
              autoComplete="off"
              placeholder="+99 (8__) ___-__-__"
              label="Telefon raqamini kiriting!"
              component={TextInput}
              error={form.errors.phone}
              value={form.values.phone || ""}
              onChange={(event) => {
                form.setFieldValue("phone", event.target.value);
              }}
            />
            <TextInput
              required
              label="Passport seriyasini kiriting!"
              placeholder="FA123456"
              onChange={(e) =>
                form.setFieldValue(
                  "passport_id",
                  e.target.value.trim().toUpperCase()
                )
              }
              value={form.values.passportId}
              error={form.errors.passportId}
              size="md"
              radius="md"
            />
            <Select
              label="Jinsni Tanlang"
              placeholder="Erkak"
              {...form.getInputProps("gender")}
              data={[
                { value: "male", label: "Erkak" },
                { value: "female", label: "Ayol" },
              ]}
            />
          </Stack>
          <Button
            loading={isPending}
            disabled={isPending}
            size="md"
            mt="15"
            color="green"
            type="submit"
            radius="md"
          >
            Yangilash
          </Button>
        </form>
      </Modal>
    </>
  );
};
export default UpdateStudentModal;
