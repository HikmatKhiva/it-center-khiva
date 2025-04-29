import { Accordion, Container, Group, Title } from "@mantine/core";
import { motion } from "motion/react";
import { Megaphone2 } from "@/assets";
const FaqSection = () => {
  return (
    <motion.section
      whileInView={{ y: [50, 0], opacity: [0, 1] }}
      transition={{ duration: 1 }}
    >
      <Container size="sm" pb="30">
        <Group align="start" justify="center">
          <motion.img
            whileInView={{ scale: [0.5, 1] }}
            transition={{ duration: 1, type: "spring" }}
            width="80"
            src={Megaphone2}
            alt="Megaphone2 icon"
          />
        </Group>
        <Title size="xl" ta="center" mb="20">
          Tez-tez beriladigan savollar.
        </Title>
        <Accordion variant="separated">
          <Accordion.Item value="attend">
            <Accordion.Control>O'quv kursiga yozilish.</Accordion.Control>
            <Accordion.Panel>
              Siz bizning o'quv markazga kelib o'zingiz hohlagan kurga
              yozilishingiz mumkin.Yoki bizning saytimiz orqali hohlagan kursni
              tanlash va paytni tanlasangiz guruh ochilish vaqtda siz bilan
              bog'lanamiz.
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="time">
            <Accordion.Control>
              Darslar qanday vaqtlarda bo'ladi.
            </Accordion.Control>
            <Accordion.Panel>
              Darslar o'quvchilarga mos paytlarda qo'yilda haftada 3 kun 2
              soatdan davom etadi.
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="laptop">
            <Accordion.Control>
              O'quvchi o'zi bilan kompyuter olib kelishlari yoki sotib olishlari
              kerakmi.
            </Accordion.Control>
            <Accordion.Panel>
              Bizning o'quv markazda barcha sharoitlar mavjud sizga shaxsiy
              kompyuter olib kelish talab qilinmaydi. Agar sizda kompyuter
              mavjud bo'lmasa sizga bizning markazga kelib o'z ustingizda
              qo'shimcha ishlash uchun sharoit yaratib beramiz.
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="payment">
            <Accordion.Control>Guruh to'lovi qanday qilindi.</Accordion.Control>
            <Accordion.Panel>
              Siz avval darsga kelib qatnashib ko'rib 3 darsan keyin to'lov
              qilishingiz kerak bo'ladi.
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="certificate">
            <Accordion.Control>Sertifiqat taqdim etiladimi.</Accordion.Control>
            <Accordion.Panel>
              Kursni muoffaqiyatli tugatganingizdan keyin sizdan kursni
              yakunlaningiz bo'yicha maxsus sinov olinadi.Sinovdan muoffaqiyatli
              o'tgan o'quvchilarni Sertifiqat bilan taqdirlanadi.
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Container>
    </motion.section>
  );
};

export default FaqSection;
