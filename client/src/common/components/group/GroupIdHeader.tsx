import { Group, Text, TextInput, Tooltip } from "@mantine/core";
import { CalendarOff, CalendarPlus, Search } from "lucide-react";
import { formatTime } from "@/utils/helper";
import { ChangeEvent, memo } from "react";
import BackButton from "../BackButton";
import GroupHeaderMenu from "./GroupHeaderMenu";
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
    const startTimeStr = group?.startTime
      ? formatTime.DateTime(group.startTime)
      : null;
    const finishedDateStr = group?.finishedDate
      ? formatTime.DateTime(group.finishedDate)
      : null;
    return (
      <Group pb="20" justify="space-between">
        <Group gap="20">
          <BackButton />
          <Text fz="14">
            Guruh nomi: <b>{group?.name}</b>
          </Text>
          <Group hidden={group.isActive == "PENDING"}>
            {startTimeStr && (
              <Tooltip label="Boshlangan sana!">
                <Text className="flex gap-1 items-center" fz="14">
                  <CalendarPlus size="16" />
                  <b>{startTimeStr}</b>
                </Text>
              </Tooltip>
            )}
            {finishedDateStr && (
              <Tooltip label="Yakunlangan sana!">
                <Text className="flex gap-1 items-center" fz="14">
                  <CalendarOff size="16" />
                  <b>{finishedDateStr}</b>
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
          <GroupHeaderMenu group={group} />
        </Group>
      </Group>
    );
  },
);
export default GroupIdHeader;
