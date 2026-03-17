import { Group, Text, TextInput, Tooltip } from "@mantine/core";
import { CalendarOff, CalendarPlus, Search } from "lucide-react";
import UpdateGroupModal from "./UpdateGroupModal";
import { formatTime } from "@/utils/helper";
import CreateStudent from "../student/CreateStudentModal";
// import FinishGroupModal from "./FinishGroupModal";
import DownloadCertificate from "./DownloadCertificate";
import { ChangeEvent, memo } from "react";
import BackButton from "../BackButton";
import { IGroup } from "@/types";
import ActivateGroupModal from "./ActivateGroupModal";
// import ActivateGroupDrawer from "./ActivateGroupDrawer";
import { useAppSelector } from "@/hooks/redux";
import { selectUser } from "@/lib/redux/reducer/admin";
import FinishGroupModal from "./FinishGroupModal";
const GroupIdHeader = memo(
  ({
    group,
    name,
    handleChangeInput,
  }: {
    group: IGroup;
    name: string;
    handleChangeInput: (event: ChangeEvent<HTMLInputElement>) => void;
  }) => {
    const admin = useAppSelector(selectUser);
    return (
      <Group pb="20" justify="space-between">
        <Group gap="20">
          <BackButton />
          {group && group.isActive !== "FINISHED" && (
            <UpdateGroupModal id={group?.id} />
          )}
          <Text fz="14">
            Guruh nomi: <b>{group?.name}</b>
          </Text>
          <Group hidden={group.isActive !== "PENDING"}>
            {group?.startTime && (
              <Tooltip label="Boshlangan sana!">
                <Text className="flex gap-1 items-center" fz="14">
                  <CalendarPlus size="16" />
                  <b>{formatTime.DateTime(group?.startTime)}</b>
                </Text>
              </Tooltip>
            )}
            {group?.finishedDate && (
              <Tooltip label="Yakunlangan sana!">
                <Text className="flex gap-1 items-center" fz="14">
                  <CalendarOff size="16" />
                  <b>{formatTime.DateTime(group?.finishedDate)}</b>
                </Text>
              </Tooltip>
            )}
          </Group>
        </Group>
        <Group>
          <TextInput
            rightSection={<Search size="16" />}
            placeholder="O'quvchi qidirish."
            onChange={handleChangeInput}
            value={name}
          />
          {group?.course?.id && group?.id && (
            <CreateStudent
              courseId={group?.course?.id}
              isActive={group.isActive === "FINISHED"}
              groupId={group?.id}
            />
          )}
          {admin?.role == "ADMIN" &&
            group.isActive !== "ACTIVE" &&
            group.isActive !== "FINISHED" && (
              <ActivateGroupModal id={group.id} duration={group.duration} />
            )}
          {group?.Students.length !== 0 && group.isActive === "ACTIVE" && (
            <FinishGroupModal id={group?.id} />
          )}
          {group?.isActive === "FINISHED" && (
            <DownloadCertificate name={group.name} id={group?.id} />
          )}
        </Group>
      </Group>
    );
  },
);
export default GroupIdHeader;
