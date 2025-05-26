import { Card, Image, Text } from "@mantine/core";
const TeacherCard = () => {
  return (
    <Card className="" withBorder p="0">
      <Image
        w={250}
        h={200}
        src="https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg"
        alt="hikmat"
      />
      <Card.Section p="20" pb="40" ta="center">
        <Text fz={{ sm: "lg", md: "xl" }}>Hikmat Bekturdiev</Text>
        <Text fz={{ sm: "xs", md: "sm" }}>Software Engineer</Text>
      </Card.Section>
    </Card>
  );
};
export default TeacherCard;