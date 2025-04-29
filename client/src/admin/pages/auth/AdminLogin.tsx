import { Paper, PaperProps, Text, Group, Image, Stepper } from "@mantine/core";
import ThemeControl from "../../../components/ThemeControl";
import { Link, useNavigate } from "react-router-dom";
import { Manager } from "../../../assets";
import { useEffect, useState } from "react";
import TabLogin from "./Tab.Login";
import TabVerify2FA from "./Tab.Verify2FA";
import { useAppSelector } from "@/hooks/redux";
import { selectUser } from "@/lib/redux/reducer/admin";
const AdminLogin = (props: PaperProps) => {
  const [username, setUsername] = useState<string>("");
  const handleLogin = (data: string) => setUsername(data);
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);
  const [active, setActive] = useState(0);
  const nextStep = () =>
    setActive((current) => (current < 2 ? current + 1 : current));
  useEffect(() => {
    if (user) {
      navigate(`/${user?.role?.toLowerCase()}`);
    }
  }, [user,navigate]);
  return (
    <section className="w-screen h-screen flex-col flex justify-center items-center">
      <Paper
        className="md:w-[400px] w-[90%]"
        shadow="md"
        radius="md"
        p="lg"
        withBorder
        {...props}
      >
        <Image w={50} m="0 auto" src={Manager} />
        <Text size="xl" py="10" className="text-center" fw={500}>
          Welcome to Admin Page
        </Text>
        <Group justify="center">
          <ThemeControl />
        </Group>
        <Stepper
          active={active}
          onStepClick={setActive}
          allowNextStepsSelect={false}
          color="green"
        >
          <Stepper.Step>
            <TabLogin nextStep={nextStep} handleLogin={handleLogin} />
          </Stepper.Step>
          <Stepper.Step>
            <TabVerify2FA username={username} />
          </Stepper.Step>
        </Stepper>
      </Paper>
      <Link className="mt-5 underline pb-1" to="/">
        Back to main page...
      </Link>
    </section>
  );
};
export default AdminLogin;