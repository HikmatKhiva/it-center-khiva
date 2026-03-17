import { useDisclosure } from "@mantine/hooks";
import {
  Box,
  Button,
  CheckIcon,
  Group,
  Modal,
  Radio,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "@/hooks/redux";
import { selectUser } from "@/lib/redux/reducer/admin";
import { InputMask } from "@react-input/mask";
import { memo, useEffect, useRef } from "react";
import {
  createNotification,
  showSuccessNotification,
} from "@/utils/notification";
import { Pencil, UserRoundPen } from "lucide-react";
import { Server } from "@/api/api";
import { IStudent, IMessageResponse, IGuarantor } from "@/types";
const UpdateStudentModal = memo(({ student }: { student: IStudent }) => {
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
      address: student.address,
      docType: student.docType,
      guarantor: {
        firstName: student?.guarantor?.firstName || "",
        secondName: student?.guarantor?.secondName || "",
        phone: student?.guarantor?.phone || "",
        passportId: student?.guarantor?.passportId || "",
      },
    } as IStudent,
  });
  const handleSubmit = async (data: IStudent) => {
    mutateAsync(data);
    idNotification.current = createNotification(isPending);
  };
  const passport = form.values.guarantor.passportId;

  const { data: guarantor, isLoading } = useQuery<IGuarantor>({
    queryKey: ["guarantor", passport],
    queryFn: () =>
      Server(`/guarantor/${passport}`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${admin?.token}`,
        },
      }),
    enabled: passport.length >= 7,
    retry: false,
  });
  useEffect(() => {
    if (guarantor) {
      form.setFieldValue("guarantor.firstName", guarantor?.firstName);
      form.setFieldValue("guarantor.secondName", guarantor?.secondName);
      form.setFieldValue("guarantor.phone", guarantor?.phone);
    }
  }, [guarantor]);
  return (
    <>
      <Button onClick={open} color="green" size="xs" variant="outline">
        <UserRoundPen size="16" />
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
              size="sm"
              radius="sm"
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
              size="sm"
              radius="sm"
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
            <Select
              label="Jinsni Tanlang"
              placeholder="Erkak"
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
                defaultChecked={form.values.docType === "PASSPORT"}
              />
              <Radio
                icon={CheckIcon}
                label="Vasiy"
                defaultChecked={form.values.docType === "BIRTHCERTIFICATE"}
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
            Yangilash
          </Button>
        </form>
      </Modal>
    </>
  );
});
export default UpdateStudentModal;
