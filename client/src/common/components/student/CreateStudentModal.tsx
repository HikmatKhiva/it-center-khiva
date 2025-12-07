import { Button, Modal, Stack, TextInput, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { studentValidation } from "@/validation";
import { useAppSelector } from "@/hooks/redux";
import { useRef } from "react";
import {
  createNotification,
  showErrorNotification,
  showSuccessNotification,
} from "@/utils/notification";
import { selectUser } from "@/lib/redux/reducer/admin";
import { discounts } from "@/config";
import { InputMask } from "@react-input/mask";
import { Server } from "@/api/api";
const CreateStudent = ({
  courseId,
  groupId,
  isGroupFinished,
}: {
  courseId: number;
  groupId: number;
  isGroupFinished: boolean;
}) => {
  const admin = useAppSelector(selectUser);
  const idNotification = useRef<string>("");
  const [opened, { open, close }] = useDisclosure(false);
  const client = useQueryClient();
  const form = useForm({
    initialValues: {
      firstName: "",
      secondName: "",
      passportId: "",
      gender: "",
      courseId: courseId,
      groupId: groupId,
      phone: "",
      discount: "0",
    } as IStudentCreate,
    validate: studentValidation,
  });
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (student: IStudentCreate) =>
      Server<IMessageResponse>(`students/create`, {
        method: "POST",
        body: JSON.stringify(student),
        headers: {
          authorization: `Bearer ${admin?.token}`,
        },
      }),
    onSuccess: (success) => {
      client.invalidateQueries({ queryKey: ["students"] });
      showSuccessNotification(idNotification.current, success?.message);
      close();
      form.reset();
    },
    onError: (error) => {
      showErrorNotification(idNotification.current, error.message);
    },
  });
  const handleSubmit = async (student: IStudentCreate) => {
    idNotification.current = createNotification(isPending);
    mutateAsync(student);
  };
  return (
    <>
      <Button
        onClick={open}
        hidden={isGroupFinished}
        fz="xs"
        rightSection={<Pencil size={14} />}
        color="green"
      >
        Yangi O'quvchi Qo'shish
      </Button>
      <Modal opened={opened} onClose={close} title=" Yangi O'quvchi Qo'shish">
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
              value={form.values.phone}
              onChange={(event) => {
                form.setFieldValue("phone", event.target.value);
              }}
            />
            <TextInput
              label="Passport seriyasini kiriting!"
              placeholder="FA123456"
              maxLength={9}
              onChange={(e) =>
                form.setFieldValue(
                  "passportId",
                  e.target.value.trim().toUpperCase()
                )
              }
              error={form.errors.passportId}
              value={form.values.passportId}
              size="md"
              radius="md"
            />

            <Select
              label="Jinsni Tanlang!"
              placeholder="Erkak"
              error={form.errors.gender}
              {...form.getInputProps("gender")}
              data={[
                { value: "male", label: "Erkak" },
                { value: "female", label: "Ayol" },
              ]}
            />
            <Select
              label="Chegirmani belgilang!"
              placeholder="10%"
              error={form.errors.discount}
              {...form.getInputProps("discount")}
              data={discounts}
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
            Qo'shish
          </Button>
        </form>
      </Modal>
    </>
  );
};
export default CreateStudent;
