import { Card, Container, Group, Text, Title } from "@mantine/core";
import { motion } from "motion/react";
import { Calendar, HTML, NoteBook } from "@/assets";
const CourseSection = () => {
  return (
    <motion.section
      whileInView={{ y: [50, 0], opacity: [0, 1] }}
      transition={{ duration: 1 }}
    >
      <Container>
        <Group align="start" justify="center">
          <motion.img
            whileInView={{ scale: [0.5, 1] }}
            transition={{ duration: 1, type: "spring" }}
            width="80"
            src={NoteBook}
            alt="NoteBook icon"
          />
        </Group>
        <Title size="xl" ta="center" mb="20">
          Bizning Kurslar
        </Title>
        <Group>
          <Card w="250" withBorder shadow="md">
            <motion.img
              whileInView={{ scale: [0.5, 1] }}
              transition={{ duration: 1, type: "spring" }}
              width="80"
              className="mx-auto"
              src={HTML}
              alt="NoteBook icon"
            />
            <Title ta="center" size="md">
              Front-End dasturlash
            </Title>
            <Group align="center" justify="center">
              <Text>4-6 oygacha</Text>
              <motion.img width="20" src={Calendar} />
            </Group>
            <Group gap="3px 10px" justify="center">
              <Text>HTML5</Text>
              <Text>CSS3</Text>
              <Text>Javascript</Text>
              <Text>React</Text>
            </Group>
          </Card>
        </Group>
      </Container>
    </motion.section>
  );
};
export default CourseSection;
