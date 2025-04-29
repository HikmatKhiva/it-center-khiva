import { Button, Divider, Group, Text } from "@mantine/core";
import {
  Clipboard,
  Eye,
  EyeOff,
  LogOut,
  SquareAsterisk,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { useClipboard } from "@mantine/hooks";
import ProfileQrCode from "./ProfileQrCode";
import { useAppDispatch } from "@/hooks/redux";
import { logout } from "@/lib/redux/reducer/admin";
const ProfilePreview = ({
  profile,
}: {
  profile: IUserProfile | undefined;
}) => {
  const [visible, setVisible] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const clipboard = useClipboard({ timeout: 500 });
  const handleVisible = () => setVisible(!visible);
  const handleClickCopy = () => {
    clipboard.copy(profile?.secret || "");
  };
  const handleLogout = () => dispatch(logout());
  return (
    <div>
      <Group mb="5">
        <UserRound />
        <Text className="capitalize ">{profile?.username}</Text>
      </Group>
      <Divider my={10} />
      <Group mb="5" justify="space-between" align="center">
        <Group>
          <SquareAsterisk />
          <Text>
            {visible
              ? profile?.secret
              : profile?.secret.slice(0, 6).padEnd(10, "*")}
          </Text>
        </Group>
        <Group gap="5">
          {profile && <ProfileQrCode profile={profile} />}
          <Button
            size="xs"
            color={clipboard.copied ? "teal" : "grape"}
            onClick={handleClickCopy}
            type="button"
          >
            <Clipboard size="16" />
          </Button>
          <Button onClick={handleVisible} type="button" size="xs">
            {visible ? <Eye size="16" /> : <EyeOff size="16" />}
          </Button>
        </Group>
      </Group>
      <Divider mb={20} />
      <Button
        onClick={handleLogout}
        color="violet"
        rightSection={<LogOut size="18" />}
      >
        Hisobdan chiqish
      </Button>
    </div>
  );
};
export default ProfilePreview;
