import {
  ActionIcon,
  Button,
  Modal,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { PenIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { useAppSelector } from "@/hooks/redux";
import { selectUser } from "@/lib/redux/reducer/admin";
import {
  createNotification,
  showErrorNotification,
  showSuccessNotification,
} from "@/utils/notification";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getGroup, updateGroup } from "@/admin/api/api.group";
import { updateGroupValidation } from "@/validation";
import useFormData from "@/hooks/useFormData";
import { useForm } from "@mantine/form";
const UpdateGroupModal = ({ id }: { id: number }) => {
  const admin = useAppSelector(selectUser);
  const idNotification = useRef<string>("");
  const [opened, { open, close }] = useDisclosure(false);
  const { loading, teachers } = useFormData();
  const client = useQueryClient();
  const { data } = useQuery({
    queryKey: ["group", id],
    queryFn: () => {
      if (id) {
        return getGroup(id, admin?.token || "");
      }
    },
    enabled: !!id && !!admin?.token,
  });
  const form = useForm({
    initialValues: {
      teacherId: data?.teacher.id.toString() || "",
      groupTime: data?.groupTime || "",
    } as INewGroup,
    validate: updateGroupValidation,
  });
  useEffect(() => {
    if (data) {
      form.setFieldValue("teacherId", data?.teacher?.id.toString());
      form.setFieldValue("groupTime", data.groupTime);
    }
  }, [data]);
  const { isPending, mutateAsync } = useMutation({
    mutationFn: (data: INewGroup) => updateGroup(id, admin?.token || "", data),
    onSuccess: (success) => {
      showSuccessNotification(idNotification.current, success?.message);
      client.invalidateQueries({ queryKey: ["group", id] });
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
      <ActionIcon onClick={open}>
        <PenIcon size="16" />
      </ActionIcon>
      <Modal opened={opened} onClose={close} title="Guruh yangilash">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
 
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
