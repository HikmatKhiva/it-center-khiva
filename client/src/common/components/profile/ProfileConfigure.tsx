import {
  Modal,
  Avatar,
  Tabs,
  FloatingIndicator,
  Group,
  FileButton,
  Button,
  ActionIcon,
  Stack,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useAppSelector } from "@/hooks/redux";
import { useRef, useState } from "react";
import classes from "@/css/tabs.module.css";
import ProfilePreview from "./ProfilePreview";
import ProfileUpdate from "./ProfileUpdate";
import { Check, X } from "lucide-react";
import { selectUser } from "@/lib/redux/reducer/admin";
import { useMutation, useQuery } from "@tanstack/react-query";
import { uploadImage } from "@/admin/api/api.admin";
import {
  createNotification,
  showErrorNotification,
  showSuccessNotification,
} from "@/utils/notification";
import ProfilePhotoDelete from "./ProfilePhotoDelete";
import { Server } from "@/api/api";
const ProfileConfigure = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const profile = useAppSelector(selectUser);
  const idNotification = useRef<string>("");
  const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
  const [value, setValue] = useState<string | null>("1");
  const [file, setFile] = useState<File | null>();
  const [controlsRefs, setControlsRefs] = useState<
    Record<string, HTMLButtonElement | null>
  >({});
  const { data, refetch } = useQuery<IUserProfile>({
    queryKey: ["profile"],
    queryFn: () =>
      Server(`admin/profile/${profile?.id}`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${profile?.token || ""}`,
        },
      }),
    enabled: !!profile?.token && !!profile.id,
  });
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: FormData) => uploadImage(data, profile?.token || ""),
    onSuccess: (success) => {
      showSuccessNotification(idNotification.current, success?.message);
      refetch();
      setFile(null);
    },
    onError: (error) => {
      showErrorNotification(idNotification.current, error.message);
    },
  });
  const setControlRef = (val: string) => (node: HTMLButtonElement) => {
    controlsRefs[val] = node;
    setControlsRefs(controlsRefs);
  };
  const clearFile = () => setFile(null);
  const handleSaveImage = async () => {
    idNotification.current = createNotification(isPending);
    if (file) {
      const form = new FormData();
      form.append("image", file);
      mutateAsync(form);
    }
  };
  return (
    <>
      <ActionIcon onClick={open} variant="default" size="lg">
        <Avatar size={28} src={data?.photo_url} alt={data?.username}>
          {data?.username.charAt(0).toUpperCase()}
        </Avatar>
      </ActionIcon>
      <Modal opened={opened} onClose={close}>
        <Group justify="center">
          <Stack gap="5" justify="center" align="center" mb={10}>
            <FileButton onChange={setFile} accept="image/png,image/jpeg">
              {(props) => (
                <Avatar
                  {...props}
                  size={60}
                  className="shadow"
                  src={file ? URL.createObjectURL(file) : data?.photo_url}
                  alt={data?.username}
                >
                  {data?.username.charAt(0).toUpperCase()}
                </Avatar>
              )}
            </FileButton>
            <ProfilePhotoDelete photo={data?.photo_url ?? null} />
          </Stack>
        </Group>
        <Group hidden={!file} justify="center" gap="1" mb="10">
          <Button
            onClick={handleSaveImage}
            disabled={isPending}
            loading={isPending}
            size="xs"
            color="green"
            variant="outline"
          >
            <Check size="16" />
          </Button>
          <Button
            disabled={isPending}
            onClick={clearFile}
            size="xs"
            color="red"
            variant="outline"
          >
            <X size="16" />
          </Button>
        </Group>
        <Tabs variant="none" value={value} onChange={setValue}>
          <Tabs.List ref={setRootRef} className={classes.list}>
            <Tabs.Tab
              value="1"
              ref={setControlRef("1")}
              className={classes.tab}
            >
              Hisob
            </Tabs.Tab>
            <Tabs.Tab
              value="2"
              ref={setControlRef("2")}
              className={classes.tab}
            >
              Yangilash
            </Tabs.Tab>
            <FloatingIndicator
              target={value ? controlsRefs[value] : null}
              parent={rootRef}
              className={classes.indicator}
            />
          </Tabs.List>
          <Tabs.Panel value="1">
            <ProfilePreview profile={data} />
          </Tabs.Panel>
          <Tabs.Panel value="2">
            <ProfileUpdate profile={data} />
          </Tabs.Panel>
        </Tabs>
      </Modal>
    </>
  );
};
export default ProfileConfigure;
