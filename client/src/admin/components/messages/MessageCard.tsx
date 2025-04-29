import { Avatar, Card, Group, Spoiler, Stack, Text } from "@mantine/core";
import MessageDeleteModal from "./MessageDeleteModal";
import { formatTime } from "@/utils/helper";
const MessageCard = ({ message }: { message: IMessage }) => {
  return (
    <Card flex="1 1 300px" pos="relative" w="300" shadow="lg">
      <MessageDeleteModal id={message.id} />
      <Group>
        <Avatar>{message.fullName.charAt(0).toUpperCase()}</Avatar>
        <Stack gap="0">
          <Text className="capitalize">{message.fullName}</Text>
          <Text>{formatTime.DateTimeHours(message.createdAt)}</Text>
        </Stack>
      </Group>
      <Card.Section p={10} pb={30}>
        <Spoiler maxHeight={20} showLabel="Show more" hideLabel="Hide">
          {message.message}
        </Spoiler>
      </Card.Section>
    </Card>
  );
};

export default MessageCard;
