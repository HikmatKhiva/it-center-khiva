import { Group, Text, TextInput, Tooltip } from "@mantine/core";
import { CalendarOff, CalendarPlus, Search } from "lucide-react";
import UpdateGroupModal from "./UpdateGroupModal";
import { formatTime } from "@/utils/helper";
import CreateStudent from "../student/CreateStudentModal";
import FinishGroupModal from "./FinishGroupModal";
import DownloadCertificate from "./DownloadCertificate";
import { ChangeEvent, memo } from "react";
import BackButton from "../BackButton";
import { IGroup } from "@/types";
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
    return (
      <Group pb="20" justify="space-between">
        <Group gap="20">
          <BackButton />
          {group && !group.isGroupFinished && (
            <UpdateGroupModal id={group?.id} />
          )}
          <Text fz="14">
            Guruh nomi: <b>{group?.name}</b>
          </Text>
          {group?.createdAt && (
            <Tooltip label="Boshlangan sana!">
              <Text className="flex gap-1 items-center" fz="14">
                <CalendarPlus size="16" />
                <b>{formatTime.DateTime(group?.createdAt)}</b>
              </Text>
            </Tooltip>
          )}
          {group?.finishedDate && (
            <Tooltip
              label={`${
                group?.isGroupFinished
                  ? "Yakunlangan sana!"
                  : "Yakunlash sanasi!"
              }`}
            >
              <Text className="flex gap-1 items-center" fz="14">
                <CalendarOff size="16" />
                <b>{formatTime.DateTime(group?.finishedDate)}</b>
              </Text>
            </Tooltip>
          )}
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
              isGroupFinished={group.isGroupFinished}
              groupId={group?.id}
            />
          )}
          {!group?.isGroupFinished && group?.Students.length !== 0 && (
            <FinishGroupModal id={group?.id} />
          )}
          {group?.isGroupFinished && (
            <DownloadCertificate name={group.name} id={group?.id} />
          )}
        </Group>
      </Group>
    );
  }
);
export default GroupIdHeader;
