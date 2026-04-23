import { PDFDocument, rgb } from "pdf-lib";
import fontKit from "@pdf-lib/fontkit";
import { memo, useCallback, useEffect, useState } from "react";
import { Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Eye, RefreshCw } from "lucide-react";
import { template } from "@/admin/template";
import Poppins from "@/admin/assets/font/Poppins/Poppins-Regular.ttf"; // Ensure this is a URL or path
import { useQuery } from "@tanstack/react-query";
import { selectUser } from "@/lib/redux/reducer/admin";
import { useAppSelector } from "@/hooks/redux";
import { Server } from "@/api/api";
// import { ICourse } from "@/types";
const CourseCertificateDemo = memo(
  ({ id, teacherFullName }: { id: number; teacherFullName: string }) => {
    const admin = useAppSelector(selectUser);
    const [opened, { open, close }] = useDisclosure(false);
    //color Original RGB values
    const red = 151;
    const green = 193;
    const blue = 25;
    const { data, isPending, refetch } = useQuery<ICourse>({
      queryKey: ["course", id],
      queryFn: () =>
        Server<ICourse>(`course/${id}`, {
          method: "GET",
          headers: {
            authorization: `Bearer ${admin?.token}`,
          },
        }),
      enabled: !!admin?.token && !!id,
    });
    const [pdfInfo, setPdfInfo] = useState<string | null>(null);
    const modifyPdf = useCallback(async () => {
      // Normalize RGB values for pdf-lib
      const normalizedRed = red / 255;
      const normalizedGreen = green / 255;
      const normalizedBlue = blue / 255;
      try {
        const response = await fetch(template);
        const pdfData = await response.arrayBuffer();
        const pdfDoc = await PDFDocument.load(pdfData);
        pdfDoc.registerFontkit(fontKit);
        // Fetch the font as an ArrayBuffer
        const fontResponse = await fetch(Poppins);
        const fontArrayBuffer = await fontResponse.arrayBuffer();
        const poppinsFont = await pdfDoc.embedFont(fontArrayBuffer);
        const page = pdfDoc.getPage(0);
        page.drawText(teacherFullName, {
          x: 60,
          y: 310,
          size: 40,
          font: poppinsFont,
          color: rgb(0, 0, 0),
        });
        page.drawText(`«${data?.nameCertificate}»`, {
          x: 45,
          y: 223,
          font: poppinsFont,
          size: 20,
          color: rgb(normalizedRed, normalizedGreen, normalizedBlue),
        });
        const currentYear = new Date().getFullYear().toString().slice(2, 4);
        // write id
        page.drawText(`${currentYear}/100-***`, {
          x: 635,
          y: 130,
          font: poppinsFont,
          size: 15,
          color: rgb(0, 0, 0),
        });
        // date time
        const date = new Date();
        const day = String(date.getDate()).padStart(2, "0"); // Get day of the month (1-31) and pad with zero if needed
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Get month (0-11, so add 1) and pad with zero
        const year = date.getFullYear();
        // date time
        page.drawText(`${day}.${month}.${year}`, {
          x: 620,
          y: 75,
          font: poppinsFont,
          size: 16,
          color: rgb(0, 0, 0),
        });
        const pdfBytes = await pdfDoc.save();
        const docUrl = URL.createObjectURL(
          new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" })
        );
        setPdfInfo(docUrl);
      } catch (error) {
        console.error("Error modifying PDF:", error);
      }
    }, [data?.nameCertificate]);
    useEffect(() => {
      modifyPdf();
      return () => {
        modifyPdf();
      };
    }, [modifyPdf]);
    const refreshPdf = async () => {
      await modifyPdf();
      refetch();
    };
    return (
      <>
        <Button
          onClick={open}
          loading={isPending}
          disabled={isPending}
          variant="outline"
          color="green"
          size="xs"
          aria-label="see certificate URL"
        >
          <Eye size="16" />
        </Button>
        <Modal
          hidden={!opened}
          opened={opened}
          size="lg"
          className="h-[400px]"
          onClose={close}
        >
          <>
            <Button onClick={refreshPdf} mb="10">
              <RefreshCw />
            </Button>
            {pdfInfo && !isPending && (
              <iframe
                className="w-full"
                height="600"
                title="test-frame"
                src={pdfInfo}
              />
            )}
          </>
        </Modal>
      </>
    );
  }
);
export default CourseCertificateDemo;
