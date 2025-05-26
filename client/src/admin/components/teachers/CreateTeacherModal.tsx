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
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { useAppSelector } from "@/hooks/redux";
import { useRef } from "react";
import { selectUser } from "@/lib/redux/reducer/admin";
import {
  createNotification,
  showErrorNotification,
  showSuccessNotification,
} from "@/utils/notification";
import { teacherValidate } from "@/validation";
import { InputMask } from "@react-input/mask";
import { Server } from "@/api/api";
const CreateTeacherModal = () => {
  const admin = useAppSelector(selectUser);
  const idNotification = useRef<string>("");
  const [opened, { open, close }] = useDisclosure(false);
  const client = useQueryClient();
  const form = useForm({
    initialValues: {
      firstName: "",
      secondName: "",
      image: null,
      phone: "",
    } as ITeacherForm,
    validate: teacherValidate,
  });
  const { isPending, mutateAsync } = useMutation({
    mutationFn: (formData: FormData) =>
      Server<IMessageResponse>(`teachers/create`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${admin?.token}`,
        },
        data: formData,
      }),
    mutationKey: ["teacher", "create"],
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
  const handleSubmit = async (teacher: ITeacherForm) => {
    const formData = new FormData();
    formData.append("firstName", teacher.firstName);
    formData.append("secondName", teacher.secondName);
    formData.append("phone", teacher.phone);
    if (teacher.image) {
      formData.append("image", teacher.image); // Append the image file to the FormData
    }
    mutateAsync(formData);
    idNotification.current = createNotification(isPending);
  };
  const setFile = (file: File | null) => {
    form.setFieldValue("image", file); // Update the form state with the selected file
  };
  const photo_url = form.values.image
    ? URL.createObjectURL(form?.values?.image as Blob)
    : ""; // Create a URL for the selected file
  return (
    <>
      <Button
        rightSection={<Pencil size={16} />}
        onClick={open}
        fz="xs"
        aria-label="open course create modal"
        aria-labelledby="open course create modal"
        color="green"
        type="button"
        variant="filled"
      >
        O'qituvchi Yaratish
      </Button>
      <Modal
        aria-label="course create modal"
        aria-labelledby="course create modal"
        opened={opened}
        onClose={close}
      >
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
              className="translate-x-[-50%] "
              size="xs"
              color="red"
              type="button"
              hidden={!form.values.image}
              onClick={() => form.setFieldValue("image", null)}
            >
              <Trash2 size="14" />
            </Button>
          </Group>
          <Stack>
            <TextInput
              onChange={(e) =>
                form.setFieldValue("firstName", e.currentTarget.value.trim())
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
                form.setFieldValue("secondName", e.currentTarget.value.trim())
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
            Yaratish
          </Button>
        </form>
      </Modal>
    </>
  );
};
export default CreateTeacherModal;
