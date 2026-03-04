import {
  Button,
  Modal,
  Stack,
  TextInput,
  Select,
  CheckIcon,
  Radio,
  Text,
  Group,
  Box,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { studentValidation } from "@/validation";
import { useAppSelector } from "@/hooks/redux";
import { memo, useRef } from "react";
import {
  createNotification,
  showErrorNotification,
  showSuccessNotification,
} from "@/utils/notification";
import { selectUser } from "@/lib/redux/reducer/admin";
import { discounts } from "@/config";
import { InputMask } from "@react-input/mask";
import { Server } from "@/api/api";
import { IStudentCreate, IMessageResponse } from "@/types";
const CreateStudent = memo(
  ({
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
        address: "",
        courseId: courseId,
        groupId: groupId,
        phone: "",
        discount: "0",
        docType: "PASSPORT",
        guarantor: {
          firstName: "",
          secondName: "",
          phone: "",
          passportId: "",
        },
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
        <Modal
          opened={opened}
          size="md"
          onClose={close}
          title=" Yangi O'quvchi Qo'shish"
        >
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
                size="sm"
                radius="sm"
              />
              <TextInput
                onChange={(e) =>
                  form.setFieldValue("secondName", e.target.value.trim())
                }
                value={form.values.secondName}
                error={form.errors.secondName}
                label="Familiyasini kiriting!"
                placeholder="Polvonov"
                size="sm"
                radius="sm"
              />
              <InputMask
                mask="+99 (8__) ___-__-__"
                replacement={{ _: /\d/ }}
                autoComplete="off"
                placeholder="+99 (8__) ___-__-__"
                label="Telefon raqamini kiriting! (ixtiyori)"
                component={TextInput}
                error={form.errors.phone}
                value={form.values.phone}
                onChange={(event) => {
                  form.setFieldValue("phone", event.target.value);
                }}
              />
              <Select
                label="Jinsni Tanlang!"
                placeholder="Erkak"
                error={form.errors.gender}
                size="sm"
                radius="sm"
                {...form.getInputProps("gender")}
                data={[
                  { value: "male", label: "Erkak" },
                  { value: "female", label: "Ayol" },
                ]}
              />
              <TextInput
                label="Yashash manzilini kiriting!"
                placeholder="Manzil..."
                maxLength={70}
                onChange={(e) => form.setFieldValue("address", e.target.value)}
                error={form.errors.address}
                value={form.values.address}
                size="sm"
                radius="sm"
              />
              <Text>Hujjat turini belgilang!</Text>
              <Group>
                <Radio
                  icon={CheckIcon}
                  label="Passport"
                  {...form.getInputProps("docType")}
                  name="document"
                  value="PASSPORT"
                  defaultChecked
                />
                <Radio
                  icon={CheckIcon}
                  label="Vasiy"
                  {...form.getInputProps("docType")}
                  name="document"
                  value="BIRTHCERTIFICATE"
                />
              </Group>
              <TextInput
                label={`${form.values.docType === "PASSPORT" ? "Passport" : "Guvohnoma"} seriyasini kiriting!`}
                placeholder={`${form.values.docType === "PASSPORT" ? "FA" : "INN"} 123456`}
                maxLength={10}
                onChange={(e) =>
                  form.setFieldValue(
                    "passportId",
                    e.target.value.trim().toUpperCase(),
                  )
                }
                error={form.errors.passportId}
                value={form.values.passportId}
                size="sm"
                radius="sm"
              />
              <Text fw="700" hidden={form.values.docType === "PASSPORT"}>
                Vasiyni ma'lumotlarini kiriting!
              </Text>
              <Box hidden={form.values.docType === "PASSPORT"}>
                <TextInput
                  label="Passport seriyasini kiriting!"
                  placeholder="FA 123456"
                  flex="2"
                  maxLength={10}
                  onChange={(e) =>
                    form.setFieldValue(
                      "guarantor.passportId",
                      e.target.value.trim().toUpperCase(),
                    )
                  }
                  // error={form.errors.guarantor?.passportId || ''}
                  value={form.values.guarantor.passportId}
                  size="sm"
                  radius="sm"
                />
                <Group>
                  <TextInput
                    onChange={(e) =>
                      form.setFieldValue(
                        "guarantor.firstName",
                        e.target.value.trim(),
                      )
                    }
                    value={form.values.guarantor.firstName}
                    // error={form.errors.guarantor.firstName}
                    label="Ismi!"
                    placeholder="Xudayshukur"
                    size="sm"
                    radius="sm"
                  />
                  <TextInput
                    onChange={(e) =>
                      form.setFieldValue(
                        "guarantor.secondName",
                        e.target.value.trim(),
                      )
                    }
                    value={form.values.guarantor.secondName}
                    // error={form.errors.guarantorSecondName}
                    label="Familiyasi!"
                    placeholder="Polvonov"
                    size="sm"
                    radius="sm"
                  />
                </Group>
                <InputMask
                  mask="+99 (8__) ___-__-__"
                  replacement={{ _: /\d/ }}
                  autoComplete="off"
                  placeholder="+99 (8__) ___-__-__"
                  label="Telefon raqamini kiriting!"
                  component={TextInput}
                  // error={form.errors.gr}
                  value={form.values.guarantor.phone}
                  onChange={(event) => {
                    form.setFieldValue("guarantor.phone", event.target.value);
                  }}
                />
              </Box>
              <Select
                label="Chegirmani belgilang!"
                placeholder="10%"
                error={form.errors.discount}
                {...form.getInputProps("discount")}
                data={discounts}
                size="sm"
                radius="sm"
              />
            </Stack>
            <Button
              loading={isPending}
              disabled={isPending}
              mt="15"
              color="green"
              type="submit"
              size="sm"
              radius="sm"
            >
              Qo'shish
            </Button>
          </form>
        </Modal>
      </>
    );
  },
);
export default CreateStudent;