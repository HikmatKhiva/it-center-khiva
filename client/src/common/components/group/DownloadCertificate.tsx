import { Button } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { DownloadIcon } from "lucide-react";
import { useAppSelector } from "@/hooks/redux";
import { selectUser } from "@/lib/redux/reducer/admin";
import { downloadGroupCertificate } from "@/api/api";
import { memo } from "react";
const DownloadCertificate = memo(
  ({ id, name }: { id: number; name: string }) => {
    const admin = useAppSelector(selectUser);
    const { mutateAsync, isPending } = useMutation({
      mutationFn: (id: number) =>
        downloadGroupCertificate(id, admin?.token || "", name),
      mutationKey: ["download", "certificate"],
    });
    const handleClickDownload = async () => {
      await mutateAsync(id);
    };
    return (
      <>
        <Button
          onClick={handleClickDownload}
          color="green"
          loading={isPending}
          rightSection={<DownloadIcon />}
        >
          Download zip
        </Button>
      </>
    );
  }
);
export default DownloadCertificate;