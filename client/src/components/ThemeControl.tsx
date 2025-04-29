import {
  ActionIcon,
  useMantineColorScheme,
  useComputedColorScheme,
} from "@mantine/core";
import { Moon, Sun } from "@/assets";
import { motion } from "motion/react";
const ThemeControl = () => {
  const { setColorScheme, colorScheme } = useMantineColorScheme({
    keepTransitions: true,
  });
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });
  return (
    <ActionIcon
      aria-labelledby="theme-mode"
      onClick={() =>
        setColorScheme(computedColorScheme === "light" ? "dark" : "light")
      }
      variant="default"
      size="lg"
      aria-label="Toggle color scheme"
    >
      <motion.img
        whileTap={{ scale: [1, 0.8] }}
        transition={{ duration: 0.8, type: "spring" }}
        src={colorScheme === "dark" ? Sun : Moon}
        width={30}
        className="object-cover"
        alt="icon theme"
      />
    </ActionIcon>
  );
};

export default ThemeControl;
