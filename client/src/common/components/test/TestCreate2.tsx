import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Container,
  Group,
  Stack,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import { EmojiScale } from "./EmojieChoice";

type Step = "start" | "quiz" | "hobby" | "result";

type Question = { id: string; section: string; text: string };

const QUESTIONS: Question[] = [
  {
    id: "Q001",
    section: "creative",
    text: "Men chiroyli ko‘rinadigan ish qilganda ko‘proq zavqlanaman.",
  },
  {
    id: "Q002",
    section: "structure",
    text: "Bir ishni qilayotganda tartib menga juda muhim.",
  },
  {
    id: "Q003",
    section: "communication",
    text: "Odamlar bilan gaplashib ishlash menga yoqadi.",
  },
  {
    id: "Q004",
    section: "numeric",
    text: "Raqamlar bilan ishlashda o‘zimni ishonchli his qilaman.",
  },
  {
    id: "Q005",
    section: "mobility",
    text: "Telefon bilan tezkor kontent qilish menga oson.",
  },
  {
    id: "Q006",
    section: "creative",
    text: "Video montaj yoki syomka qilish menga qiziq.",
  },
  {
    id: "Q007",
    section: "creative",
    text: "Bir xil ishni uzoq vaqt qilganda zerikaman.",
  },
  {
    id: "Q008",
    section: "creative",
    text: "Chizmalar va maketlar bilan ishlash menga yoqadi.",
  },
  {
    id: "Q009",
    section: "technical",
    text: "Kod yoki texnik jarayonlarni tushunishga qiziqaman.",
  },
  {
    id: "Q010",
    section: "technical",
    text: "Xatolarni topish va tuzatish menga yoqadi.",
  },
  {
    id: "Q011",
    section: "outcome",
    text: "Ishda tez natija ko‘rish meni motivatsiya qiladi.",
  },
  {
    id: "Q012",
    section: "outcome",
    text: "Ishni asta‑sekin, puxta qilishni afzal ko‘raman.",
  },
  {
    id: "Q013",
    section: "technical",
    text: "Kompyuterda murakkab narsalarni o‘rganishdan qo‘rqmayman.",
  },
  {
    id: "Q014",
    section: "creative",
    text: "Rasm yoki dizayn orqali fikrni ifodalash menga oson.",
  },
  {
    id: "Q015",
    section: "communication",
    text: "Ijtimoiy tarmoqlarda faol bo‘lish menga yoqadi.",
  },
];

// const CHOICES = [5, 4, 3, 2, 1, 0, -1];

const RESULTS = [
  { name: "Graphic Design", reason: "Strong creative and visual signals." },
  { name: "SMM", reason: "Communication and social content fit well." },
  {
    name: "Mobileography",
    reason: "Phone-based content making looks natural.",
  },
];

function StartScreen({ onStart }: { onStart: () => void }) {
  return (
    <Card
      radius="32px"
      shadow="xl"
      p="xl"
      style={{ maxWidth: 760, margin: "0 auto" }}
    >
      <Stack gap="md" align="center" py="xl">
        <Badge size="lg" variant="light" color="blue">
          COURSE MATCH
        </Badge>
        <Title ta="center" order={1}>
          Find the best course for you
        </Title>
        <Text c="dimmed" ta="center" size="lg" maw={560}>
          Answer 15 short questions and add one line about your hobbies. We will
          suggest the courses that fit you best.
        </Text>
        <Button size="lg" radius="xl" onClick={onStart}>
          Start assessment
        </Button>
      </Stack>
    </Card>
  );
}

function QuizScreen({
  question,
  index,
  total,
  value,
  onSelect,
  onNext,
  onBack,
}: {
  question: Question;
  index: number;
  total: number;
  value?: number;
  onSelect: (v: number) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <Card
      radius="32px"
      shadow="xl"
      p="xl"
      style={{ maxWidth: 860, margin: "0 auto" }}
    >
      <Stack gap="xl" py="md">
        <Group justify="center">
          <Badge variant="light" color="blue" radius="xl">
            {question.section.toUpperCase()}
          </Badge>
        </Group>
        <Stack gap={6} align="center">
          <Text c="dimmed">
            Question {index} of {total}
          </Text>
          <Title order={2} ta="center" maw={700}>
            {question.text}
          </Title>
        </Stack>
        <Stack gap="sm" align="center">
          <EmojiScale onChange={onSelect} value={value} />
          {/* <Text size="sm" c="dimmed" ta="center">
            Answer quickly. First feeling is best.
          </Text> */}
        </Stack>
        <Group justify="space-between">
          <Button variant="default" onClick={onBack}>
            Back
          </Button>
          <Button onClick={onNext}>Next</Button>
        </Group>
      </Stack>
    </Card>
  );
}

function HobbyScreen({
  value,
  onChange,
  onSubmit,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
}) {
  return (
    <Card
      radius="32px"
      shadow="xl"
      p="xl"
      style={{ maxWidth: 860, margin: "0 auto" }}
    >
      <Stack gap="lg" py="md">
        <Title order={2} ta="center">
          Tell us about your hobbies
        </Title>
        <Text c="dimmed" ta="center">
          One short sentence is enough. Example: I like drawing, editing videos,
          and using my phone for content.
        </Text>
        <Textarea
          minRows={5}
          value={value}
          onChange={(e) => onChange(e.currentTarget.value)}
          placeholder="Write your hobbies or interests..."
        />
        <Button size="lg" radius="xl" onClick={onSubmit}>
          See my matches
        </Button>
      </Stack>
    </Card>
  );
}

function ResultScreen({
  items,
  onRestart,
}: {
  items: { name: string; reason: string }[];
  onRestart: () => void;
}) {
  return (
    <Card
      radius="32px"
      shadow="xl"
      p="xl"
      style={{ maxWidth: 960, margin: "0 auto" }}
    >
      <Stack gap="lg">
        <Title order={2} ta="center">
          Your recommended courses
        </Title>
        {items.map((item) => (
          <Card key={item.name} radius="24px" withBorder>
            <Group justify="space-between" align="flex-start">
              <div>
                <Text fw={700} size="lg">
                  {item.name}
                </Text>
                <Text c="dimmed">{item.reason}</Text>
              </div>
              <Badge color="blue" variant="light">
                Top match
              </Badge>
            </Group>
          </Card>
        ))}
        <Button radius="xl" onClick={onRestart}>
          Try again
        </Button>
      </Stack>
    </Card>
  );
}

export default function AssessmentPage() {
  const [step, setStep] = useState<Step>("start");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [hobbyText, setHobbyText] = useState("");
  const current = QUESTIONS[index];
  const results = useMemo(() => RESULTS, []);

  return (
    <Container size="lg" py="xl">
      {step === "start" && <StartScreen onStart={() => setStep("quiz")} />}
      {step === "quiz" && current && (
        <QuizScreen
          question={current}
          index={index + 1}
          total={QUESTIONS.length}
          value={answers[current.id]}
          onSelect={(v) => setAnswers((p) => ({ ...p, [current.id]: v }))}
          onBack={() =>
            index === 0 ? setStep("start") : setIndex((i) => i - 1)
          }
          onNext={() =>
            index === QUESTIONS.length - 1
              ? setStep("hobby")
              : setIndex((i) => i + 1)
          }
        />
      )}
      {step === "hobby" && (
        <HobbyScreen
          value={hobbyText}
          onChange={setHobbyText}
          onSubmit={() => setStep("result")}
        />
      )}
      {step === "result" && (
        <ResultScreen
          items={results}
          onRestart={() => {
            setStep("start");
            setIndex(0);
            setAnswers({});
            setHobbyText("");
          }}
        />
      )}
    </Container>
  );
}
