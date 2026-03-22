import { graduateMen, men, teacher, women } from "@/admin/assets/svg";
import {
  BookOpenText,
  GraduationCap,
  Hourglass,
  UserRound,
  UserRoundCheck,
  UsersRound,
  UserX2,
} from "lucide-react";

import { NumberTicker } from "@/animation/number-ticker";
import { Card, Group, Indicator, Text } from "@mantine/core";
import { Banknote } from "lucide-react";
import { IStats } from "@/types";
const StatCards = ({ data }: { data: IStats[] }) => {
  return (
    <>
      <Group mb={20}>
        <Indicator inline size={16} offset={1} position="top-end" color="green">
          <Card bg="" color="white" shadow="sm" withBorder w={250} h={180}>
            <Group mb={15}>
              <BookOpenText />
              <Text>Kurslar:</Text>
              <NumberTicker
                className="text-white"
                value={data ? data[0]?.totalCourses : 0}
              />
            </Group>
            <Group mb={15}>
              <UsersRound />
              <Text>Guruhlar:</Text>
              <NumberTicker
                className="text-white"
                value={data ? data[0]?.activeGroups : 0}
              />
            </Group>
            <Group mb={15}>
              <UserRound />
              <Text>O'qituvchilar:</Text>
              <NumberTicker
                className="text-white"
                value={data ? data[0]?.totalTeachers : 0}
              />
            </Group>
            <Group mb={15}>
              <Banknote />
              <Text>Qarzdorlar:</Text>
              <NumberTicker
                className="text-white"
                value={data[0]?.totalDebtors ? data[0]?.totalDebtors : 0}
              />
            </Group>
          </Card>
        </Indicator>
        <Indicator inline size={16} offset={1} position="top-end" color="red">
          <Card withBorder w={250} h={180}>
            <Group mb={15}>
              <GraduationCap />
              <Text>Yakunlanganlar:</Text>
              <NumberTicker
                className="text-white"
                value={data ? data[0]?.finishedStudents : 0}
              />
            </Group>
            <Group mb={15}>
              <UsersRound />
              <Text>Guruhlar:</Text>
              <NumberTicker
                className="text-white"
                value={data ? data[0]?.finishedGroups : 0}
              />
            </Group>
            <Group mb={15}>
              <UserRound />
              <Text>Ayol o'quvchilar:</Text>
              <NumberTicker
                className="text-white"
                value={data ? data[0]?.totalFinishedFemaleStudents : 0}
              />
            </Group>
            <Group mb={15}>
              <UserRound />
              <Text>Erkak o'quvchilar:</Text>
              <NumberTicker
                className="text-white"
                value={data ? data[0]?.totalFinishedMaleStudents : 0}
              />
            </Group>
          </Card>
        </Indicator>
        <Indicator
          inline
          size={16}
          offset={1}
          position="top-end"
          color="blue"
          processing
        >
          <Card withBorder w={250} h={180}>
            <Group mb={15}>
              <UsersRound />
              <Text>Umumiy:</Text>
              <NumberTicker
                className="text-white"
                value={data ? data[0]?.totalStudents : 0}
              />
            </Group>
            <Group mb={15}>
              <UserRound />
              <Text>Erkak:</Text>
              <NumberTicker
                className="text-white"
                value={data ? data[0]?.totalMaleStudents : 0}
              />
            </Group>
            <Group mb={15}>
              <UserRound />
              <Text>Ayol:</Text>
              <NumberTicker
                className="text-white"
                value={data ? data[0]?.totalFemaleStudents : 0}
              />
            </Group>
          </Card>
        </Indicator>
        <Indicator
          inline
          size={16}
          offset={1}
          position="top-end"
          color="grape"
          processing
        >
          <Card withBorder w={250} h={180}>
            <Group mb={15}>
              <UsersRound />
              <Text>Umumiy:</Text>
              <NumberTicker value={data ? data[0]?.totalNewstudent : 0} />
            </Group>
            <Group mb={15}>
              <UserRoundCheck />
              <Text>Darsga kelgan:</Text>
              <NumberTicker value={data ? data[0]?.totalNewstudentCAME : 0} />
            </Group>
            <Group mb={15}>
              <UserX2 />
              <Text>Darsga kelmagan:</Text>
              <NumberTicker
                className="dark:text-white"
                value={data ? data[0]?.totalNewstudentNOT_CAME : 0}
              />
            </Group>
            <Group mb={15}>
              <Hourglass />
              <Text>Kutish xolatida:</Text>
              <NumberTicker
                className="dark:text-white"
                value={data ? data[0]?.totalNewstudentPENDING : 0}
              />
            </Group>
          </Card>
        </Indicator>
      </Group>
    </>
  );
};
export default StatCards;
