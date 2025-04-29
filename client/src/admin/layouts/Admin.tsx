import { Outlet, useNavigate } from "react-router-dom";
import { ActionIcon, AppShell, Burger, Group, Menu } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { motion } from "motion/react";
import { AdminIcon } from "@/assets";
import { useAppDispatch } from "@/hooks/redux";
import { logout } from "@/lib/redux/reducer/admin";
// import AdminConfigure from "../components/admin/AdminConfigure";
import ThemeControl from "@/components/ThemeControl";
import AdminNavbar from "@/admin/components/AdminNavbar";
import LogoSVG from "@/motions_components/LogoSVG";
import ProfileConfigure from "@/common/components/profile/ProfileConfigure";
const Admin = () => {
  const dispatch = useAppDispatch();
  const [opened, { toggle, close }] = useDisclosure();
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate("/");
    dispatch(logout());
  };
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: { base: 300 },
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group align="center" justify="space-between" h="100%" px="md">
          <div className="flex items-center gap-4">
            <Burger
              opened={opened}
              onClick={toggle}
              size="sm"
              hiddenFrom="sm"
            />
            <LogoSVG />
          </div>
          <div className="flex items-center gap-4">
            <ProfileConfigure />
            <ThemeControl />
            <Menu>
              <Menu.Target>
                <ActionIcon variant="default" size="lg">
                  <motion.img
                    whileTap={{ scale: [1, 0] }}
                    transition={{ duration: 0.8, type: "spring" }}
                    src={AdminIcon}
                    width={30}
                    className="object-cover"
                    alt="icon theme"
                  />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                {/* <AdminConfigure /> */}
                <Menu.Item onClick={handleLogout}>Logout</Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </div>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar className="transition-all duration-300 " h="100vh">
        <AdminNavbar close={close} />
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};
export default Admin;
