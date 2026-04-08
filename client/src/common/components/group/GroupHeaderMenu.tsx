import { useState } from "react";
import { Menu, Button } from "@mantine/core";
import UpdateGroupModal from "./UpdateGroupModal";
import CreateStudent from "../student/CreateStudentModal";
import ActivateGroupModal from "./ActivateGroupModal";
import { useAppSelector } from "@/hooks/redux";
import { selectUser } from "@/lib/redux/reducer/admin";
import FinishGroupModal from "./FinishGroupModal";
import { useMutation } from "@tanstack/react-query";
import { downloadGroupCertificate, downloadGroupContract } from "@/api/api";
import {
  CheckCheck,
  DownloadIcon,
  MenuIcon,
  Pencil,
  Play,
  UserRound,
} from "lucide-react";
const GroupHeaderMenu = ({ group }: { group: IGroup }) => {
  const admin = useAppSelector(selectUser);
  const [modalGroupUpdate, setModalGroupUpdate] = useState<boolean>(false);
  const [modalCreateStudent, setModalCreateStudent] = useState<boolean>(false);
  const [modalActivateGroup, setModalActivateGroup] = useState<boolean>(false);
  const [modalFinishedGroup, setModalFinishedGroup] = useState<boolean>(false);
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (id: number) =>
      downloadGroupCertificate(id, admin?.token || "", group.name),
    mutationKey: ["download", "certificate"],
  });
  const handleClickDownload = async () => {
    await mutateAsync(group?.id);
  };
  const { mutateAsync: downloadContracts } = useMutation({
    mutationFn: (id: number) =>
      downloadGroupContract(id, admin?.token || "", group.name),
    mutationKey: ["download", "contracts"],
  });
  const handleClickDownloadContracts = async () => {
    await downloadContracts(group?.id);
  };
  return (
    <>
      <Menu shadow="md" width={200}>
        <Menu.Target>
          <Button rightSection={<MenuIcon size="16" />} color="indigo">
            Menu
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            disabled={group?.isActive === "FINISHED" || !group}
            onClick={() => setModalCreateStudent(true)}
            rightSection={<UserRound size="16" />}
          >
            O'quvchi qo'shish
          </Menu.Item>
          <Menu.Item
            disabled={group?.isActive !== "FINISHED" || isPending}
            onClick={handleClickDownload}
            rightSection={<DownloadIcon size="16" />}
          >
            Certifikatelarni yuklash
          </Menu.Item>
          <Menu.Item
            disabled={group?.isActive === "PENDING" || isPending}
            onClick={handleClickDownloadContracts}
            rightSection={<DownloadIcon size="16" />}
          >
            Contractlarni yuklash
          </Menu.Item>
          <Menu.Divider />
          <Menu.Label>Danger zone</Menu.Label>
          <Menu.Item
            onClick={() => setModalGroupUpdate(true)}
            rightSection={<Pencil size="16" />}
          >
            O'zgartirish
          </Menu.Item>
          <Menu.Item
            disabled={
              group?.Students.length == 0 ||
              ["PENDING", "FINISHED"]?.includes(group.isActive)
            }
            onClick={() => setModalFinishedGroup(true)}
            rightSection={<CheckCheck size="16" />}
          >
            Guruhni yakunlash.
          </Menu.Item>
          <Menu.Item
            disabled={["ACTIVE", "FINISHED"]?.includes(group.isActive)}
            rightSection={<Play size="16" />}
            onClick={() => setModalActivateGroup(true)}
          >
            Guruhni faollashtirish
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      {/* Modals */}
      <UpdateGroupModal
        id={group.id}
        opened={modalGroupUpdate}
        close={() => setModalGroupUpdate(false)}
      />
      <CreateStudent
        opened={modalCreateStudent}
        close={() => setModalCreateStudent(false)}
        courseId={group?.course?.id}
        groupId={group?.id}
      />
      <ActivateGroupModal
        opened={modalActivateGroup}
        close={() => setModalActivateGroup(false)}
        id={group.id}
        duration={group.duration}
      />
      <FinishGroupModal
        opened={modalFinishedGroup}
        close={() => setModalFinishedGroup(false)}
        id={group?.id}
      />
    </>
  );
};
export default GroupHeaderMenu;
