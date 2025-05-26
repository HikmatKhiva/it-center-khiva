import { Title } from "@mantine/core";
import { TextAnimate } from "@/animation/text-animation";
import { Zoom } from "@/assets";
import { motion } from "motion/react";
const EmptyPage = () => {
  return (
    <div className="flex justify-center w-full items-center">
      <Title className="text-[#53519D]" fz={{base:"15px",md:"26px"}}>
        <TextAnimate>Ma'kumotlar hali yuklanmagan.</TextAnimate>
      </Title>
      <motion.img
        whileInView={{ scale: [0.5, 1] }}
        transition={{ duration: 1, type: "spring" }}
        src={Zoom}
        alt="zoom"
        width={60}
      />
    </div>
  );
};
export default EmptyPage;