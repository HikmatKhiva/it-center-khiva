import {  Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { QrCode } from "lucide-react";
import QRCode from "react-qr-code";
import {authenticator } from "otplib"
import { IUserProfile } from "@/types";
const ProfileQrCode = ({ profile }: { profile: IUserProfile }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const otpauth = authenticator.keyuri(profile.username, 'it-khiva.uz', profile.secret);
  return (
    <>
      <Button type="button" onClick={open} size="xs">
        <QrCode size="16" />
      </Button>
      <Modal opened={opened} onClose={close}>
        <QRCode value={otpauth}  className="mx-auto"/>
      </Modal>
    </>
  );
};
export default ProfileQrCode;