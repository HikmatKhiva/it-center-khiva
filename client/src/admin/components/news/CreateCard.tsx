import {
  Card,
  Image,
  Button,
  Group,
  FileButton,
  TextInput,
  Textarea,
} from "@mantine/core";
import { ArrowRight } from "lucide-react";
import { CoolMode } from "@/animation/cool-mode";
import { Logo } from "@/assets"
const CreateCard = (props: CreateCardProps) => {
  return (
    <div className="relative w-[300px]">
      <div className=" absolute top-0 left-1/2  px-2 py-1 -translate-x-1/2 z-10 mantine-Card-root m_1b7284a3 mantine-Paper-root ">
        300x250
      </div>
      <Card w="300" shadow="sm" padding="lg" radius="md" withBorder>
        <Card.Section>
          <FileButton
            onChange={(file) =>
              file &&
              props.handleFileChange({
                target: { files: [file] },
              } as unknown as React.ChangeEvent<HTMLInputElement>)
            }
            accept="image/png,image/jpeg"
          >
            {({ ...buttonProps }) => (
              <Image
                {...buttonProps}
                src={`${
                  props.newsCard.image
                    ? URL.createObjectURL(props.newsCard.image)
                    : props.photo
                    ? props.photo
                    : Logo
                }`}
                h={250}
                w={300}
                alt={
                  props.newsCard.title
                    ? props.newsCard.title
                    : "picture newsCard"
                }
              />
            )}
          </FileButton>
        </Card.Section>
        <Group mt="md" mb="xs">
          <TextInput
            required
            label="Yangilikni sarlavhasi"
            className="w-full border-b"
            variant="unstyled"
            value={props.newsCard.title}
            maxLength={35}
            minLength={15}
            name="title"
            onChange={(e) => props.handleInputChange(e)}
          />
        </Group>
        <Textarea
          required
          label="Yangilikni qisqa tarifi"
          value={props.newsCard.description}
          className="border-b "
          size="sm"
          c="dimmed"
          variant="unstyled"
          maxLength={100}
          minLength={30}
          name="description"
          onChange={(e) => props.handleInputChange(e)}
        />
        <CoolMode>
          <Button
            type="button"
            aria-label="example news button"
            color="green"
            className="mt-2"
            rightSection={<ArrowRight size={18} />}
          >
            Batafsil
          </Button>
        </CoolMode>
      </Card>
    </div>
  );
};
export default CreateCard;
