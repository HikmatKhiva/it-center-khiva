import { Container, FloatingIndicator, Group, Image } from "@mantine/core";
import { Tabs } from "@mantine/core";
import { useState } from "react";
import classes from "./contact.module.css";
import AddNewStudent from "@/components/contact/AddNewStudent";
import AnonymMessage from "@/components/contact/AnonymMessage";
import { Manager, Pencil, Mail } from "@/assets";
const ContactPage = () => {
  const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
  const [value, setValue] = useState<string | null>("1");
  const [controlsRefs, setControlsRefs] = useState<
    Record<string, HTMLButtonElement | null>
  >({});
  const setControlRef = (val: string) => (node: HTMLButtonElement) => {
    controlsRefs[val] = node;
    setControlsRefs(controlsRefs);
  };
  return (
    <section>
      <Container size="lg">
        <Tabs
          variant="none"
          className={classes.container}
          value={value}
          onChange={setValue}
        >
          <Tabs.List ref={setRootRef} className={classes.list}>
            <Tabs.Tab
              value="1"
              ref={setControlRef("1")}
              className={classes.tab}
              fz={{ base: "12px", sm: "14px" }}
              rightSection={<Image src={Pencil} w={20} alt="pencil 3D" />}
            >
              Kursga yozilish
            </Tabs.Tab>
            <Tabs.Tab
              value="2"
              ref={setControlRef("2")}
              fz={{ base: "12px", sm: "14px" }}
              className={classes.tab}
              rightSection={<Image src={Mail} w={20} alt="pencil 3D" />}
            >
              Anonym Xabar
            </Tabs.Tab>
            <FloatingIndicator
              target={value ? controlsRefs[value] : null}
              parent={rootRef}
              className={classes.indicator}
            />
          </Tabs.List>
          <Tabs.Panel value="1">
            <AddNewStudent />
          </Tabs.Panel>
          <Tabs.Panel value="2">
            <AnonymMessage />
          </Tabs.Panel>
        </Tabs>
        <Group pt={15} justify="center">
          <a href="https://t.me/Itparkxiva" className="flex gap-2 items-center">
            Manager bilan bog'lanish
            <Image src={Manager} w={30} h={30} alt="manager icon" />
          </a>
        </Group>
      </Container>
    </section>
  );
};
export default ContactPage;