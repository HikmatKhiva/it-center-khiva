import { Button } from "@mantine/core";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";
const NavigateCertificate = ({ url }: { url: string }) => {
  const URL = import.meta.env.VITE_BACKEND_URL;
  return (
    <>
      <Link to={`${URL}certificate?code=${url}`} target="__blank">
        <Button
          variant="outline"
          color="green"
          size="xs"
          aria-label="see certificate URL"
        >
          <Eye />
        </Button>
      </Link>
    </>
  );
};
export default NavigateCertificate;