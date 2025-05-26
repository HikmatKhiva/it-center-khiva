import { TextInput, Group, Text } from "@mantine/core";
import CourseTable from "../../components/course/CourseTable";
import { BookOpenText, Search } from "lucide-react";
import CreateCourseModal from "../../components/course/CreateCourseModal";
import { useState } from "react";
const AdminCourse = () => {
  const [name, setName] = useState("");
  return (
    <section>
      <Group pb="10" justify="space-between">
        <Group>
          <Text size="lg" fw="bold">
            Kurslar boshqaruv bo'limi
          </Text>
          <BookOpenText />
        </Group>
        <Group>
          <TextInput
            rightSection={<Search size={16} />}
            onChange={(event) => setName(event.target.value)}
            size="sm"
            value={name}
            placeholder="Kurs qidirish..."
          />
          <CreateCourseModal />
        </Group>
      </Group>
      <CourseTable name={name} />
    </section>
  );
};
export default AdminCourse;