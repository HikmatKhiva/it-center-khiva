import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import ImageResize from "tiptap-extension-resize-image";
import "@mantine/tiptap/styles.css";
import { Button, Divider, Group, Text } from "@mantine/core";
import { ArrowLeft, Save, Youtube } from "lucide-react";
import { DateInput } from "@mantine/dates";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import CreateCard from "../../components/news/CreateCard";
import { useMutation } from "@tanstack/react-query";
import { useAppSelector } from "@/hooks/redux";
import { selectUser } from "@/lib/redux/reducer/admin";
import {
  createNotification,
  showErrorNotification,
  showSuccessNotification,
} from "@/utils/notification";
import CustomIFrame from "@/admin/extension/CustomIFrame";
import { Server } from "@/api/api";
const AdminNewsCreate = () => {
  const admin = useAppSelector(selectUser);
  const [content, setContent] = useState<string>("");
  const idNotification = useRef<string>("");
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (formData: FormData) =>
      Server<IMessageResponse>(`news/create`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${admin?.token}`,
        },
        data: formData,
      }),
    mutationKey: ["news", "create"],
    onSuccess: (success) => {
      showSuccessNotification(idNotification.current, success.message);
      navigate("/admin/news");
    },
    onError: (error) => {
      showErrorNotification(idNotification.current, error.message);
    },
  });
  const [newsCard, setNewsCard] = useState<INewsCard>({
    title: "",
    description: "",
    image: null,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewsCard((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setNewsCard((prevState) => ({
      ...prevState,
      image: file,
    }));
  };
  const [createdAt, setCreatedAt] = useState<Date>(new Date());
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      // Image.configure({ allowBase64: true }),
      ImageResize.configure({ allowBase64: true }), // Use ImageResize here
      CustomIFrame,
    ],
    content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });
  // editor?.commands.
  const handleSubmit = () => {
    const formData = new FormData();
    if (newsCard.image) {
      formData.append("image", newsCard.image);
    }
    formData.append("title", newsCard.title);
    formData.append("description", newsCard.description);
    formData.append("content", content);
    formData.append("createdAt", createdAt.toISOString());
    mutateAsync(formData);
    idNotification.current = createNotification(isPending);
  };
  const handleImageUpload = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string); // Convert file to base64 string
      reader.readAsDataURL(file);
    });
  };
  const handleUploadIframeData = (url: string) => {
    if (editor) {
      editor.commands?.setIframe({ src: url });
    }
  };
  return (
    <>
      <Group align="center" justify="space-between" mb="10">
        <Group align="center">
          <Button
            onClick={() => navigate(-1)}
            color="red"
            variant="outline"
            size="xs"
          >
            <ArrowLeft size={16} />
          </Button>
          <Text size="lg" fw="bold">
            Yangilik Yaratish bo'limi.
          </Text>
        </Group>
        <Group>
          <DateInput
            value={createdAt}
            onChange={(value) => setCreatedAt(value || new Date())}
            placeholder="Date input"
          />
          <Button
            onClick={handleSubmit}
            loading={isPending}
            disabled={isPending}
            aria-label="save news button"
            color="green"
            size="sm"
            fz={"sm"}
            rightSection={<Save size="16" />}
          >
            Saqlash.
          </Button>
        </Group>
      </Group>
      <Divider py={15} />
      <Group wrap="wrap" align="start" justify="center">
        <RichTextEditor
          className="flex-grow"
          w={650}
          autoFocus
          h={600}
          editor={editor}
        >
          <RichTextEditor.Toolbar sticky stickyOffset={60}>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Control
                onClick={() => {
                  const url = prompt("Enter iframe URL");
                  if (url) {
                    handleUploadIframeData(url);
                  }
                }}
              >
                <Youtube size="16" />
              </RichTextEditor.Control>
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
              <RichTextEditor.Underline />
              <RichTextEditor.Strikethrough />
              <RichTextEditor.ClearFormatting />
              <RichTextEditor.Highlight />
              <RichTextEditor.Code />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Control
                onClick={async () => {
                  const fileInput = document.createElement("input");
                  fileInput.type = "file";
                  fileInput.accept = "image/*";
                  fileInput.onchange = async () => {
                    const file = fileInput.files?.[0];
                    if (file) {
                      const imageUrl = (await handleImageUpload(
                        file
                      )) as string;
                      if (editor) {
                        editor
                          .chain()
                          .focus()
                          .setImage({ src: imageUrl })
                          .run();
                      }
                    }
                  };
                  fileInput.click();
                }}
              >
                🖼️
              </RichTextEditor.Control>
            </RichTextEditor.ControlsGroup>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Link />
              <RichTextEditor.Unlink />
            </RichTextEditor.ControlsGroup>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.H1 />
              <RichTextEditor.H2 />
              <RichTextEditor.H3 />
              <RichTextEditor.H4 />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.AlignLeft />
              <RichTextEditor.AlignCenter />
              <RichTextEditor.AlignJustify />
              <RichTextEditor.AlignRight />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Undo />
              <RichTextEditor.Redo />
            </RichTextEditor.ControlsGroup>
          </RichTextEditor.Toolbar>

          <RichTextEditor.Content />
        </RichTextEditor>
        <CreateCard
          photo=""
          newsCard={newsCard}
          handleFileChange={handleFileChange}
          handleInputChange={handleInputChange}
        />
      </Group>
    </>
  );
};
export default AdminNewsCreate;
