import { Container, Group, Title } from "@mantine/core";
import { Computer } from "@/assets";
import TeacherCard from "@/components/teacher/TeacherCard";
import { motion } from "motion/react";
const TeacherSection = () => {
  return (
    <motion.section
      whileInView={{ y: [50, 0], opacity: [0, 1] }}
      transition={{ duration: 1 }}
      className="pb-10"
    >
      <Container>
        <Group justify="center">
          <motion.img
            whileInView={{ scale: [0.5, 1] }}
            transition={{ duration: 1, type: "spring" }}
            width="80"
            src={Computer}
            alt="computer icon"
          />
        </Group>
        <Title size="xl" ta="center" mb="20">
          O'qituvchilarimiz
        </Title>
        <Group pt="20" justify="center">
          <TeacherCard />
          <TeacherCard />
          <TeacherCard />
        </Group>
      </Container>
    </motion.section>
  );
};
export default TeacherSection;