import { graduateMen, men, teacher, women } from "@/admin/assets/svg";
import {
  BookOpenText,
  GraduationCap,
  Hourglass,
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
              <NumberTicker value={data ? data[0]?.totalCourses : 0} />
            </Group>
            <Group mb={15}>
              <UsersRound />
              <Text>Guruhlar:</Text>
              <NumberTicker value={data ? data[0]?.activeGroups : 0} />
            </Group>
            <Group mb={15}>
              <img
                src={teacher}
                alt="teacher"
                width={30}
                className="object-cover"
              />
              <Text>O'qituvchilar:</Text>
              <NumberTicker value={data ? data[0]?.totalTeachers : 0} />
            </Group>
            <Group mb={15}>
              <Banknote />
              <Text>Qarzdorlar:</Text>
              <NumberTicker value={data[0]?.totalDebtors ? data[0]?.totalDebtors : 0} />
            </Group>
          </Card>
        </Indicator>

        <Indicator inline size={16} offset={1} position="top-end" color="red">
          <Card withBorder w={250} h={180}>
            <Group mb={15}>
              <GraduationCap />
              <Text>Yakunlanganlar:</Text>
              <NumberTicker value={data ? data[0]?.finishedStudents : 0} />
            </Group>
            <Group mb={15}>
              <UsersRound />
              <Text>Guruhlar:</Text>
              <NumberTicker value={data ? data[0]?.finishedGroups : 0} />
            </Group>
            <Group mb={15}>
              <img src={graduateMen} alt="graduateMen" width={28} />
              <Text>Ayol o'quvchilar:</Text>
              <NumberTicker
                value={data ? data[0]?.totalFinishedFemaleStudents : 0}
              />
            </Group>
            <Group mb={15}>
              <img src={graduateMen} alt="graduateMen" width={28} />
              <Text>Erkak o'quvchilar:</Text>
              <NumberTicker
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
              <NumberTicker value={data ? data[0]?.totalStudents : 0} />
            </Group>
            <Group mb={15}>
              <img src={men} alt="men" width={28} />
              <Text>Erkak:</Text>
              <NumberTicker value={data ? data[0]?.totalMaleStudents : 0} />
            </Group>
            <Group mb={15}>
              <img src={women} alt="woman" width={28} />
              <Text>Ayol:</Text>
              <NumberTicker value={data ? data[0]?.totalFemaleStudents : 0} />
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
                value={data ? data[0]?.totalNewstudentNOT_CAME : 0}
              />
            </Group>
            <Group mb={15}>
              <Hourglass />
              <Text>Kutish xolatida:</Text>
              <NumberTicker
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
