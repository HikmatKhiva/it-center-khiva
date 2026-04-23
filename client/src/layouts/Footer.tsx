import {
  ActionIcon,
  Group,
  Container,
  Stack,
  Image,
} from "@mantine/core";
import LogoSVG from "@/motions_components/LogoSVG";
import { CallOnly, Instagram, Location, Telegram } from "../assets";
const Footer = () => {
  return (
    <footer className="m_9f59b069 m_9bd7b098 ">
      <Container p="20px 5px 20px ">
        <Group justify="space-between" align="flex-start">
          <Stack gap="10px">
            <LogoSVG />
            <Group gap="1">
              <Image src={CallOnly} w="20" alt="phone icon" />
              <a href="tel:+998912798401" className="text-xs font-medium">
                +998912798401
              </a>
            </Group>
            <Group gap="1">
              <Image src={Location} w="20" alt="location icon" />
              <a
                href="https://maps.app.goo.gl/ZywLsEwmFEd1BX747"
                className="text-xs font-medium"
              >
                Khiva,Amir Temur ko'chasi
              </a>
            </Group>
          </Stack>
          <Group gap="10px" wrap="wrap">
            <ActionIcon
              component="a"
              href="https://t.me/Itparkxiva"
              variant="outline"
              p="6"
              radius="100%"
              color="cyan"
            >
              <Image
                src={Telegram}
                alt="telegram icon"
                className="mr-[0.8px]"
              />
            </ActionIcon>
            <ActionIcon
              component="a"
              href="https://www.instagram.com/itpark.khiva"
              variant="outline"
              p="3"
              radius="100%"
              color="pink"
            >
              <Image src={Instagram} alt="instagram icon" />
            </ActionIcon>
          </Group>
        </Group>
      </Container>
    </footer>
  );
};
export default Footer;