import { Avatar, ActionIcon, Menu, Switch, Group, Text } from "@mantine/core";
import { useAppSelector } from "@/hooks/redux";
import { useState } from "react";
import ProfilePreview from "./ProfilePreview";
import ProfileUpdate from "./ProfileUpdate";
import { DoorOpen } from "lucide-react";
import { selectUser } from "@/lib/redux/reducer/admin";
import { useQuery } from "@tanstack/react-query";
import { Server } from "@/api/api";
import ProfileLogout from "./ProfileLogout";
import { useSoundPreference } from "@/hooks/useSoundPreference ";
const ProfileConfigure = () => {
  const profile = useAppSelector(selectUser);
  const { toggleSound, soundEnabled } = useSoundPreference();
  const { data } = useQuery<IUserProfile>({
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
  const [modalProfileUpdate, setModalProfileUpdate] = useState<boolean>(false);
  const [modalProfileLogout, setModalProfileLogout] = useState<boolean>(false);
  const [modalProfilePreview, setModalProfilePreview] =
    useState<boolean>(false);
  return (
    <>
      <Menu trigger="click-hover" openDelay={100} closeDelay={400}>
        <Menu.Target>
          <ActionIcon variant="default" size="lg">
            <Avatar size={28} src={data?.photo_url} alt={data?.username}>
              {data?.username.charAt(0).toUpperCase()}
            </Avatar>
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            disabled={!data}
            onClick={() => setModalProfilePreview(true)}
          >
            Hisob
          </Menu.Item>
          <Menu.Item
            disabled={!data}
            onClick={() => setModalProfileUpdate(true)}
          >
            Hisobni yangilash
          </Menu.Item>
          <Menu.Item onClick={toggleSound}>
            <Group justify="space-between">
              <Text size="sm">Ovoz</Text>
              <Switch
                checked={soundEnabled}
                size="sm"
                onLabel="ON"
                offLabel="OFF"
              />
            </Group>
          </Menu.Item>
          <Menu.Divider />
          <Menu.Label>Danger zone</Menu.Label>
          <Menu.Item
            color="red"
            onClick={() => setModalProfileLogout(true)}
            rightSection={<DoorOpen size="16" />}
          >
            Chiqish
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <ProfileUpdate
        profile={data}
        opened={modalProfileUpdate}
        close={() => setModalProfileUpdate(false)}
      />
      <ProfilePreview
        opened={modalProfilePreview}
        close={() => setModalProfilePreview(false)}
        profile={data}
      />
      <ProfileLogout
        close={() => setModalProfileLogout(false)}
        opened={modalProfileLogout}
      />
    </>
  );
};
export default ProfileConfigure;
