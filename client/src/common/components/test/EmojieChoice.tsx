import { motion } from "motion/react";
import { Grid, Stack, Text } from "@mantine/core";

const options = [
  { emoji: "😄", label: "Juda roziman", value: 4, color: "#22c55e" },
  { emoji: "🙂", label: "Roziman", value: 3, color: "#84cc16" },
  { emoji: "🙁", label: "Rozi emasman", value: 2, color: "#f59e0b" },
  { emoji: "😣", label: "Juda rozi emasman", value: 1, color: "#ef4444" },
];

export function EmojiScale({
  value,
  onChange,
}: {
  value?: number;
  onChange: (v: number) => void;
}) {
  return (
    <Grid>
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <Grid.Col span={6} className="text-center">
            <motion.button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              whileHover={{ scale: 1.08, y: -4 }}
              whileTap={{ scale: 0.95 }}
              animate={
                active
                  ? { scale: [1, 1.12, 1], y: [0, -2, 0] }
                  : { scale: 1, y: 0 }
              }
              transition={{ type: "spring", stiffness: 380, damping: 20 }}
              style={{
                border: "none",
                cursor: "pointer",
                borderRadius: 28,
                padding: "18px 16px",
                minWidth: 180,
                background: active ? opt.color : "white",
                color: active ? "white" : "#0f172a",
                boxShadow: active
                  ? `0 16px 34px ${opt.color}33`
                  : "0 10px 24px rgba(15, 23, 42, 0.08)",
              }}
            >
              <Stack gap={6} align="center">
                <motion.span
                  animate={
                    active
                      ? { rotate: [0, -6, 6, 0], scale: [1, 1.2, 1] }
                      : { rotate: 0, scale: 1 }
                  }
                  transition={{ duration: 0.35 }}
                  style={{ fontSize: 34, lineHeight: 1 }}
                >
                  {opt.emoji}
                </motion.span>
                <Text fw={700} size="sm" ta="center">
                  {opt.label}
                </Text>
              </Stack>
            </motion.button>
          </Grid.Col>
        );
      })}
    </Grid>
  );
}
