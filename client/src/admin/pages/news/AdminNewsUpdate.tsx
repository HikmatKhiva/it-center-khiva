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
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import CreateCard from "@/admin/components/news/CreateCard";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "@/hooks/redux";
import { selectUser } from "@/lib/redux/reducer/admin";
import { DateInput } from "@mantine/dates";
import {
  createNotification,
  showErrorNotification,
  showSuccessNotification,
} from "@/utils/notification";
import CustomIFrame from "@/admin/extension/CustomIFrame";
import { Server } from "@/api/api";
import { IMessageResponse, INews, INewsCard } from "@/types";
const AdminNewsUpdate = () => {
  const admin = useAppSelector(selectUser);
  const idNotification = useRef<string>("");
  const client = useQueryClient();
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data, isFetching, isLoading } = useQuery<INews>({
    queryFn: () =>
      Server<INews>(`news/${slug}`, {
        method: "GET",
      }),
    queryKey: ["news", slug],
  });
  const [content, setContent] = useState<string>(data?.content || "");
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (formData: FormData) =>
      Server<IMessageResponse>(`news/update/${slug}`, {
        method: "PUT",
        headers: {
          authorization: `Bearer ${admin?.token}`,
        },
        data: formData,
      }),
    mutationKey: ["news", "create"],
    onSuccess: (success) => {
      client.invalidateQueries({ queryKey: ["news", slug] });
      showSuccessNotification(idNotification.current, success.message);
      navigate("/admin/news");
    },
    onError: (error) => {
      showErrorNotification(idNotification.current, error.message);
    },
  });
  const [newsCard, setNewsCard] = useState<INewsCard>({
    title: data?.title || "",
    description: data?.description || "",
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
  useEffect(() => {
    if (data) {
      setCreatedAt(new Date(data?.createdAt));
      setNewsCard((prev) => ({
        ...prev,
        title: data.title,
        description: data.description,
      }));
      setContent(data?.content);
    }
  }, [data]);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      ImageResize.configure({ allowBase64: true }), // Use ImageResize here
      CustomIFrame,
    ],
    content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });
  const handleSubmit = () => {
    idNotification.current = createNotification(isPending);
    const formData = new FormData();
    if (newsCard.image) {
      formData.append("image", newsCard.image);
    }
    formData.append("title", newsCard.title);
    formData.append("description", newsCard.description);
    formData.append("content", content);
    formData.append("createdAt", createdAt.toISOString());
    mutateAsync(formData);
  };
  const handleImageUpload = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
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
            Yangilik o'zgartirish bo'limi
          </Text>
        </Group>
        <Group>
          <DateInput
            value={createdAt}
            onChange={(value) => setCreatedAt((value ?? new Date()) instanceof Date ? value as unknown as Date : new Date())}
            placeholder="Date input"
          />
          <Button
            disabled={isPending}
            onClick={handleSubmit}
            aria-label="save news button"
            color="green"
            size="sm"
            fz={"sm"}
            rightSection={<Save size="16" />}
          >
            Saqlash
          </Button>
        </Group>
      </Group>
      <Divider py={15} />
      <Group wrap="wrap" align="start" justify="center">
        {isLoading || isFetching ? (
          <Text>Loading</Text>
        ) : (
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
        )}
        <CreateCard
          photo={data?.photo_url || ""}
          newsCard={newsCard}
          handleFileChange={handleFileChange}
          handleInputChange={handleInputChange}
        />
      </Group>
    </>
  );
};
export default AdminNewsUpdate;
