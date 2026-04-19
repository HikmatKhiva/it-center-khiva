import { useDisclosure } from "@mantine/hooks";
import {
  Avatar,
  Button,
  FileButton,
  Group,
  Modal,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "@/hooks/redux";
import { Trash2, UserRoundPen } from "lucide-react";
import {
  createNotification,
  showErrorNotification,
  showSuccessNotification,
} from "@/utils/notification";
import { useRef } from "react";
import { selectUser } from "@/lib/redux/reducer/admin";
import { teacherValidate } from "@/validation";
import { InputMask } from "@react-input/mask";
import { Server } from "@/api/api";
const UpdateTeacherModal = ({ teacher }: { teacher: ITeacher }) => {
  const admin = useAppSelector(selectUser);
  const idNotification = useRef<string>("");
  const client = useQueryClient();
  const [opened, { open, close }] = useDisclosure(false);
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: FormData) =>
      Server<IMessageResponse>(`teachers/update/${teacher.id}`, {
        method: "PUT",
        headers: {
          authorization: `Bearer ${admin?.token}`,
        },
        data: data,
      }),
    mutationKey: ["teacher", "update", teacher.id],
    onSuccess: (success) => {
      client.invalidateQueries({ queryKey: ["teachers"] });
      showSuccessNotification(idNotification.current, success?.message);
      close();
      form.reset();
    },
    onError: (error) => {
      showErrorNotification(idNotification.current, error.message);
    },
  });
  const form = useForm({
    initialValues: {
      firstName: teacher?.firstName || "",
      secondName: teacher?.secondName || "",
      phone: teacher.phone || "",
      image: null,
    } as ITeacherForm,
    validate: teacherValidate,
  });
  const handleSubmit = async (teacher: ITeacherForm) => {
    idNotification.current = createNotification(isPending);
    const formData = new FormData();
    formData.append("firstName", teacher.firstName);
    formData.append("secondName", teacher.secondName);
    formData.append("phone", teacher.phone);
    if (teacher.image) {
      formData.append("image", teacher.image);
    }
    mutateAsync(formData);
  };
  const setFile = (file: File | null) => {
    form.setFieldValue("image", file);
  };
  const photo_url = form.values.image
    ? URL.createObjectURL(form?.values?.image as Blob)
    : teacher?.photo_url;
  const deletePhoto = async () => {
    if (!admin?.token || !teacher.id) return;
    await Server<IMessageResponse>(`teachers/deletePhoto/${teacher.id}`, {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${admin?.token}`,
      },
    });
    client.invalidateQueries({ queryKey: ["teachers"] });
    close();
  };
  return (
    <>
      <Button onClick={open} color="green" size="xs" variant="outline">
        <UserRoundPen size="16" />
      </Button>
      <Modal opened={opened} onClose={close}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Group justify="center " mb="20">
            <FileButton onChange={setFile} accept="image/png,image/jpeg">
              {(props) => (
                <Avatar {...props} size={60} radius="xl" src={photo_url} />
              )}
            </FileButton>
            <Button
              pos="absolute"
              left="50%"
              top="125px"
              className="translate-x-[-50%] z-10"
              size="xs"
              color="red"
              type="button"
              hidden={!form.values.image}
              onClick={() => form.setFieldValue("image", null)}
            >
              <Trash2 size="14" />
            </Button>
            <Button
              pos="absolute"
              left="50%"
              top="125px"
              className="translate-x-[-50%] "
              size="xs"
              color="red"
              type="button"
              hidden={!photo_url}
              onClick={deletePhoto}
            >
              <Trash2 size="14" />
            </Button>
          </Group>
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
              size="sm"
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
          </Stack>
          <Button
            loading={isPending}
            disabled={
              isPending || !!form.errors.firstName || !!form.errors.secondName
            }
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
};
export default UpdateTeacherModal;