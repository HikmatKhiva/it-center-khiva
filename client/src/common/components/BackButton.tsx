import { ActionIcon } from "@mantine/core";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BackButton = ({
  size = "md",
  color = "red",
  variant = "outline",
}: {
  size?: string;
  color?: string;
  variant?: string;
}) => {
  const navigate = useNavigate();
  return (
    <>
      <ActionIcon
        onClick={() => navigate(-1)}
        color={color}
        variant={variant}
        size={size}
      >
        <ArrowLeft size={16} />
      </ActionIcon>
    </>
  );
};

export default BackButton;
